import { Module } from '@nestjs/common';
import { EventEmitterModule as EventEmitterModuleImport } from '@nestjs/event-emitter';
import { Repository } from 'src/repositories/repository';

import { EventEmitterService } from './event-emitter.base.service';

@Module({
  imports: [EventEmitterModuleImport.forRoot()],
  providers: [EventEmitterService, Repository],
  exports: [EventEmitterService],
})
export class EventEmitterModule { }
