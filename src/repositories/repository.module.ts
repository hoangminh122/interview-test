import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEnvironmentService } from 'src/modules/base/config/config-environment.base.service';
import { UtilsModule } from 'src/utils/utils.module';

import { Metric } from './entities';
import { MetricRepository } from './metric.repository';

@Global()
@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Metric])],
  providers: [ConfigEnvironmentService, MetricRepository],
  exports: [MetricRepository],
})
export class RepositoryModule { }
