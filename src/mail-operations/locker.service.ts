import { Injectable } from '@nestjs/common';
import { RedisService } from '@songkeys/nestjs-redis';
import { OrderEntity } from '../entities/db/order.entity';

@Injectable()
export class LockerService {
  constructor(private redisService: RedisService) {
  }

  async isLock(order: OrderEntity) {
    const client = this.redisService.getClient();
    const isLockExist = await client.exists(this.formatLockKey(order));
    return isLockExist === 1;
  }

  async lock(order: OrderEntity) {
    const client = this.redisService.getClient();
    await client.setex(this.formatLockKey(order), 30, 1);
  }

  async unlock(order: OrderEntity) {
    const client = this.redisService.getClient();
    await client.del(this.formatLockKey(order));
  }

  async updateLock(order: OrderEntity) {
    await this.lock(order);
  }

  private formatLockKey(order: OrderEntity): string {
    return `order:${order.id}:process:lock`;
  }
}
