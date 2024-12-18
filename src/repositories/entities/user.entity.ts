import { Column, Entity } from 'typeorm';
import { CommonEntity } from './base/common.entity';
import {
  BASE_ENTITY_DOMAIN,
  TABLE_NAMES_WITH_PREFIX,
} from 'src/utils/constants/common.constant';

@Entity({ name: TABLE_NAMES_WITH_PREFIX.USER })
export class User extends CommonEntity {
  @Column({
    name: BASE_ENTITY_DOMAIN.USER_COLUMNS.USERNAME,
    nullable: false,
  })
  username: string;

  @Column({
    name: BASE_ENTITY_DOMAIN.USER_COLUMNS.PASSWORD,
    nullable: false,
    select: false,
  })
  password: string;


  @Column({
    name: BASE_ENTITY_DOMAIN.USER_COLUMNS.EMAIL,
    nullable: false,
  })
  email: string;

}
