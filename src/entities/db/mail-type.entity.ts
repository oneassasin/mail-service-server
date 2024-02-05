import {
  Column, Entity, JoinColumn, ManyToOne
} from 'typeorm';
import { AbstractUUidModel } from './abstract-uuid-model';
import { EMailType } from '../enums/mail-type.enum';

@Entity({ name: 'mail_types' })
export class MailTypeEntity extends AbstractUUidModel {
  @Column()
  typeName: EMailType;

  @Column({ nullable: true })
  emailProviderId?: number;

  @ManyToOne(() => MailTypeEntity)
  @JoinColumn({ name: 'mailTypeId' })
  mailType?: MailTypeEntity;

  @Column({ nullable: true })
  mailTypeId?: string;
}
