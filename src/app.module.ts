import { Module } from '@nestjs/common';
import { MetricTrackingModule } from './modules/metric-tracking/metric-tracking.module';
import { DatabaseModule } from './modules/base/database/database.base.module';

@Module({
  imports: [DatabaseModule, MetricTrackingModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
