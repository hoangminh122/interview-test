import { Logger } from '@nestjs/common';

export class BaseUtil {
  protected readonly logger = new Logger('Util');
}
