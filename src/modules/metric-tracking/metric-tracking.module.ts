import { Module } from '@nestjs/common';
import { MetricTrackingController } from './metric-tracking.controller';
import { MetricTrackingService } from './metric-tracking.service';
import { Repository } from 'src/repositories/repository';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { RepositoryModule } from 'src/repositories/repository.module';
import { ConfigEnvironmentModule } from '../base/config/config-environment.base.module';
import { MetricTrackingImplementService } from './metric-tracking.implement';
import { MetricLibModule } from '@app/metric-lib/metric-lib.module';

@Module({
    imports: [EventEmitterModule, RepositoryModule, ConfigEnvironmentModule, MetricLibModule],
    controllers: [MetricTrackingController],
    providers: [

        MetricTrackingService,
        Repository,
        EventEmitter2,
        MetricTrackingImplementService,
    ],
})
export class MetricTrackingModule { }
