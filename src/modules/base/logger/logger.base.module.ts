import { Module } from '@nestjs/common';

import { EventEmitterModule } from '../event-emitter/event-emitter.base.module';
import { LoggerService } from './logger.base.service';
import { LoggerToTeamsService } from './logger-to-teams.service';
@Module({
  imports: [EventEmitterModule],
  controllers: [],
  providers: [LoggerService, LoggerToTeamsService],
})
export class LoggerModule {}
