import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryBase } from 'src/_core/repository.base';
import { Repository } from 'typeorm';
import { Metric } from './entities';
import { GetMetricDto } from 'src/modules/metric-tracking/dto/get-metric.dto';
import {
  IAliasMapping,
  QueryHandlerBuilder,
} from 'src/utils/customer-select-query-builder';
import { IMetricForChart } from 'src/utils/interfaces/model.interface';

@Injectable()
export class MetricRepository extends RepositoryBase<Metric> {
  constructor(
    @InjectRepository(Metric)
    public repository: Repository<Metric>,
  ) {
    super(repository);
  }

  createCustomQueryBuilder<Entity>(
    alias: string,
    query: GetMetricDto = null,
    mapping: IAliasMapping = null,
  ) {
    return new QueryHandlerBuilder<Metric, GetMetricDto>(
      this.createQueryBuilder(alias),
      query,
      mapping,
    );
  }
}
