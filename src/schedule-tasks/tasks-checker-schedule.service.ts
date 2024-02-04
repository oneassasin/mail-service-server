import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TaskStructure } from '../entities/structures/task.structure';
import { Cron, Timeout } from '@nestjs/schedule';
import { OrderEntity } from '../entities/db/order.entity';
import { EOrderStatus } from '../entities/enums/order-status.enum';
import { LockerService } from '../mail-operations/locker.service';

@Injectable()
export class TasksCheckerScheduleService {
  private logger = new Logger(TasksCheckerScheduleService.name);
  private isLock = false;

  constructor(@InjectQueue('tasks') private tasksQueue: Queue<TaskStructure>,
              private lockerService: LockerService) {
  }

  @Timeout(5000)
  async onTimeout() {
    await this.safeOnTick();
  }

  @Cron('*/30 * * * * *')
  async onEvery30Seconds() {
    await this.safeOnTick();
  }

  private async safeOnTick() {
    if (this.isLock) {
      return;
    }

    try {
      this.isLock = true;
      await this.onTick();
    } catch (err) {
      this.logger.error('Error in check tasks', err.stack);
    } finally {
      this.isLock = false;
    }
  }

  private async onTick() {
    const orders = await OrderEntity.findBy({
      status: EOrderStatus.Wait,
    });

    for (const order of orders) {
      try {
        const isLocked = await this.lockerService.isLock(order);

        if (isLocked) {
          continue;
        }

        await this.tasksQueue.add({
          orderId: order.id,
        });
      } catch (err) {
        this.logger.error(err, err.stack);
      }
    }
  }
}
