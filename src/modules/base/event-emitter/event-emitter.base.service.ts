import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Request } from 'express';
import { Repository } from 'src/repositories/repository';
import {
  COUNT_MAX_LISTENERS,
  EVENT_EMITTER_LISTEN,
} from 'src/utils/constants/event-emitter.constant';

import { LoggerService } from '../logger/logger.base.service';

@Injectable()
export class EventEmitterService extends LoggerService {
  private static eventEmitter: EventEmitter2;
  constructor(
    private model: Repository,
    @Inject(REQUEST) public readonly req: Request,
    eventEmitter: EventEmitter2,
  ) {
    if (!EventEmitterService.eventEmitter) {
      EventEmitterService.eventEmitter = eventEmitter;
    }
    EventEmitterService.eventEmitter.setMaxListeners(COUNT_MAX_LISTENERS);
    super(req, eventEmitter);
  }

  static getIns() {
    return EventEmitterService.eventEmitter;
  }


  @OnEvent(EVENT_EMITTER_LISTEN.LOGGER_MODULE.LOG)
  log(message: string) {
    this.logEvent(message);
  }

  @OnEvent(EVENT_EMITTER_LISTEN.LOGGER_MODULE.ERROR)
  error(payload: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[];
    obj: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  }) {
    this.errorEvent(null, this.formatters(payload.obj), payload.args);
  }

  @OnEvent(EVENT_EMITTER_LISTEN.LOGGER_MODULE.WARN)
  warn(payload: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[];
    obj: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  }) {
    this.warnEvent(null, this.formatters(payload.obj), payload.args);
  }

}
