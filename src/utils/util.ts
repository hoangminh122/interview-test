import { Injectable } from '@nestjs/common';

import { BaseUtil } from './base.util';
import { FetchUtil } from './fetch.util';
import { TimeUtil } from './time.util';

@Injectable()
export class Util extends BaseUtil {
  constructor(
    public readonly time: TimeUtil,
    public readonly fetch: FetchUtil,
  ) {
    super();
  }
}
