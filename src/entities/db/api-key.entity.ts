import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'api_keys' })
export class ApiKeyEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp with time zone', { default: () => 'now()' })
  lastUse: Date;
}
