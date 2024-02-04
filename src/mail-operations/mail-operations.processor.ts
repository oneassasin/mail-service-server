import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { LockerService } from './locker.service';
import { TaskStructure } from '../entities/structures/task.structure';
import { Job } from 'bull';
import { OrderEntity } from '../entities/db/order.entity';
import * as moment from 'moment';
import { MailOperationsService } from './mail-operations.service';
import { EOrderStatus } from '../entities/enums/order-status.enum';

@Processor('tasks')
export class MailOperationsProcessor {
  private logger = new Logger(MailOperationsProcessor.name);

  constructor(private lockerService: LockerService,
              private mailOperationsService: MailOperationsService) {
  }

  @Process({ concurrency: 100 })
  async onTaskProcess(task: Job<TaskStructure>) {
    const { orderId } = task.data;
    const order = await OrderEntity.findOneBy({ id: orderId });

    const isLock = await this.lockerService.isLock(order);
    if (isLock) {
      return;
    }

    await this.lockerService.lock(order);

    try {
      await this.handleOrder(order);
    } catch (err) {
      this.logger.error(err, err.stack);
    } finally {
      await this.handleOrderEnd(order);
      await this.lockerService.unlock(order);
    }
  }

  private async handleOrder(order: OrderEntity) {
    do {
      await order.reload()
      await this.lockerService.updateLock(order);

      const isReceived = await this.mailOperationsService.checkMailsForOrder(order);
      if (isReceived) {
        order.status = EOrderStatus.Complete;
      }

      await order.save();

      if (isReceived) {
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 15 * 1000));
    } while (moment().isBefore(moment(order.endAt)));

    order.status = EOrderStatus.NotReceived;
    await order.save();
  }

  private async handleOrderEnd(order: OrderEntity) {
    await this.mailOperationsService.releaseImapClient(order);
  }
}
