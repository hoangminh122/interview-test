/* istanbul ignore file */
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { BaseUtil } from './base.util';
import { TIME_FORMAT_TYPE } from './enums/common.enum';

@Injectable()
export class TimeUtil extends BaseUtil {
  getTimeNow(momentNow = moment()) {
    return momentNow.toDate();
  }

  format(date: Date, type: TIME_FORMAT_TYPE): string {
    return moment(date).format(type);
  }
}
