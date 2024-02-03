import { BaseEntity, Column, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  removedAt: Date;

  async remove(): Promise<this> {
    this.removedAt = new Date();
    await this.save();
    return this;
  }

  async save(): Promise<this> {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }

    await super.save();
    return this;
  }
}
