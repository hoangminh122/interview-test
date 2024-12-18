import { BASE_ENTITY_DOMAIN } from 'src/utils/constants/common.constant';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({
    name: BASE_ENTITY_DOMAIN.BASE_COLUMNS.CREATED_AT,
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: BASE_ENTITY_DOMAIN.BASE_COLUMNS.UPDATED_AT,
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    name: BASE_ENTITY_DOMAIN.BASE_COLUMNS.CREATED_BY,
    type: 'varchar',
    nullable: true,
  })
  createdBy: string;

  @Column({
    name: BASE_ENTITY_DOMAIN.BASE_COLUMNS.UPDATED_BY,
    type: 'varchar',
    nullable: true,
  })
  updatedBy: string;
}

export class SoftDeletion {
  @DeleteDateColumn({
    nullable: true,
    name: BASE_ENTITY_DOMAIN.BASE_COLUMNS.DELETED_AT,
  })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;
}
