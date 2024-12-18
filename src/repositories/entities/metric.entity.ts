import {
  BASE_ENTITY_DOMAIN,
  TABLE_NAMES_WITH_PREFIX,
} from 'src/utils/constants/common.constant';
import { Column, Entity } from 'typeorm';

import { CommonEntity } from './base/common.entity';
import { METRIC_TYPE, METRIC_UNIT } from 'src/utils/enums/tracking.enum';

@Entity({ name: TABLE_NAMES_WITH_PREFIX.METRIC })
export class Metric extends CommonEntity {
  @Column({
    name: BASE_ENTITY_DOMAIN.METRIC_COLUMNS.USER_ID,
    type: 'varchar',
    nullable: false,
  })
  userId: string;

  @Column({
    name: BASE_ENTITY_DOMAIN.METRIC_COLUMNS.TYPE,
    type: 'enum',
    nullable: false,
    enum: METRIC_TYPE,
  })
  type: METRIC_TYPE;

  @Column({
    name: BASE_ENTITY_DOMAIN.METRIC_COLUMNS.DATE,
    type: 'timestamp',
    nullable: false,
  })
  date: Date;

  @Column({
    name: BASE_ENTITY_DOMAIN.METRIC_COLUMNS.VALUE,
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  value: number;

  @Column({
    name: BASE_ENTITY_DOMAIN.METRIC_COLUMNS.UNIT,
    type: 'enum',
    nullable: false,
    enum: METRIC_UNIT
  })
  unit: string;
}
