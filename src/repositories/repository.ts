import { Injectable } from '@nestjs/common';
import { MetricRepository } from './metric.repository';
import { GetMetricDto } from 'src/modules/metric-tracking/dto/get-metric.dto';
import { IAliasMapping, QueryHandlerBuilder } from 'src/utils/customer-select-query-builder';


@Injectable()
export class Repository {
  constructor(
    public readonly metricRepository: MetricRepository,
  ) { }
}
