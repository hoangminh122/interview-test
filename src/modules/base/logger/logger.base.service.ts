/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService as LoggerServiceImport } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import pino, { Logger } from 'pino';
import { EVENT_EMITTER_LISTEN } from 'src/utils/constants/event-emitter.constant';

import { ConfigEnvironmentService } from '../config/config-environment.base.service';

// @Injectable()
export class LoggerService implements LoggerServiceImport {
  private logger: Logger;
  constructor(
    private readonly request: Request,
    protected eventEmitter: EventEmitter2,
  ) {
    this.logger = pino({
      level: ConfigEnvironmentService.getIns().get('LOG_LEVEL') || 'info',
    });
  }

  log(message: string) {
    if (this.eventEmitter) {
      this.eventEmitter.emit(EVENT_EMITTER_LISTEN.LOGGER_MODULE.LOG, message);
    } else {
      this.logger.info(message);
    }
  }

  logEvent(message: string) {
    this.logger.info(message);
  }

  error(
    obj: {
      [key: string]: any;
    },
    ...args: any[]
  ) {
    if (this.eventEmitter) {
      this.eventEmitter.emit(EVENT_EMITTER_LISTEN.LOGGER_MODULE.ERROR, {
        obj,
        args,
      });
    } else {
      this.logger.error(null, this.formatters(obj), args);
    }
  }

  errorEvent(
    obj: {
      [key: string]: any;
    },
    ...args: any[]
  ) {
    this.logger.error(null, this.formatters(obj), args);
  }

  warn(
    obj: {
      [key: string]: any;
    },
    ...args: any[]
  ) {
    if (this.eventEmitter) {
      this.eventEmitter.emit(EVENT_EMITTER_LISTEN.LOGGER_MODULE.WARN, {
        obj,
        args,
      });
    } else {
      this.logger.warn(null, this.formatters(obj), args);
    }
  }

  warnEvent(
    obj: {
      [key: string]: any;
    },
    ...args: any[]
  ) {
    this.logger.warn(null, this.formatters(obj), args);
  }

  formatters(data: { [key: string]: any }) {
    try {
      if (typeof data !== 'object') {
        return data;
      }

      return {
        ...data,
        url: this.request?.url,
        tradeId:
          this.request?.headers?.['X-Trace-Id'] ||
          this.request?.headers?.['x-request-id'],
      };
    } catch (err) {
      console.error(err);
      return data;
    }
  }
}
