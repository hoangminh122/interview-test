import { Injectable } from '@nestjs/common';
import { Repository } from 'src/repositories/repository';
import { TABLE_NAMES } from 'src/utils/constants/common.constant';
import { GetMetricDto } from './dto/get-metric.dto';
import { Brackets } from 'typeorm';
import { IAliasMapping } from 'src/utils/customer-select-query-builder';

@Injectable()
export class MetricTrackingImplementService {
    constructor(private readonly model: Repository) { }

    generateQueryBuilder(query: GetMetricDto, aliasMapping: IAliasMapping) {
        const builder = this.model.metricRepository.createCustomQueryBuilder(
            `${TABLE_NAMES.METRIC}`,
            query,
            aliasMapping,
        );

        //
        const typeQuery = query[`type`];

        if (typeQuery) {
            builder.andWhere(
                new Brackets((qb) => {
                    qb.orWhere(`${builder.alias}.type = :type`, {
                        [`type`]: typeQuery,
                    });
                }),
            );
        }
        return builder;
    }
}
