import { AbstractModel } from './abstract-model';
import { Column, Entity } from 'typeorm';
import { EOrderStatus } from '../enums/order-status.enum';

@Entity('orders')
export class OrderEntity extends AbstractModel {
  @Column()
  emailAccountId: number;

  @Column()
  domain: string;

  @Column('timestamp with time zone')
  endAt: Date;

  @Column({ default: EOrderStatus.Wait })
  status: EOrderStatus;
}
