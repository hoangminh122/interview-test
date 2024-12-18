import { Module } from '@nestjs/common';

import { EventEmitterModule } from '../event-emitter/event-emitter.base.module';
import { LoggerService } from './logger.base.service';
@Module({
  imports: [EventEmitterModule],
  controllers: [],
  providers: [LoggerService],
})
export class LoggerModule { }
