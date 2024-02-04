import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractUUidModel } from './abstract-uuid-model';
import { OrderEntity } from './order.entity';

@Entity('income_emails')
export class IncomingEmailEntity extends AbstractUUidModel {
  @Column()
  subject: string;

  @Column()
  from: string;

  @Column()
  html: string;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column()
  orderId: number;
}
