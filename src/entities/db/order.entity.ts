import { AbstractModel } from './abstract-model';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class OrderEntity extends AbstractModel {
  @Column()
  emailId: number;

  @Column()
  domain: string;

  // TODO: Add other fields
}
