import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractUUidModel } from './abstract-uuid-model';
import { OrderEntity } from './order.entity';

@Entity()
export class IncomingEmailEntity extends AbstractUUidModel {
  @Column()
  html: string;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column()
  orderId: number;

  // TODO: Add other fields
}
