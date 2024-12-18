import { Injectable } from '@nestjs/common';
import { Repository } from 'src/repositories/repository';
import { TABLE_NAMES } from 'src/utils/constants/common.constant';
import { GetMetricDto } from './dto/get-metric.dto';
import { Brackets } from 'typeorm';
import { IAliasMapping } from 'src/utils/customer-select-query-builder';
import { METRIC_DISTANCE_UNIT, METRIC_TEMPERATURE_UNIT, METRIC_TYPE } from 'src/utils/enums/tracking.enum';
import { Metric } from 'src/repositories/entities';
import { MetricLibService } from 'libs/metric-lib/src/metric-lib.service';
import { IMetricUnitService } from 'libs/metric-lib/src/metric-unit/metric-unit.interface';

@Injectable()
export class MetricTrackingImplementService {

    constructor(
        private readonly model: Repository,
        private metricDistanceService: MetricLibService,
        private metricTemperatureService: MetricLibService
    ) {
        // Set instance
        this.metricDistanceService.setInsDefault(METRIC_TYPE.DISTANCE);
        this.metricTemperatureService.setInsDefault(METRIC_TYPE.TEMPERATURE)
    }

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

    convertToUnit(data: Metric[], unitDistance: METRIC_DISTANCE_UNIT, unitTemperature: METRIC_TEMPERATURE_UNIT) {
        return data.map(item => {
            const itemNew = item;
            if (item.type === METRIC_TYPE.DISTANCE && unitDistance) {
                itemNew.value = this.metricDistanceService.executeValue(item.value, { unitFrom: item.unit as METRIC_DISTANCE_UNIT, unitTo: unitDistance })
                itemNew.unit = unitDistance;
            }
            if (item.type === METRIC_TYPE.TEMPERATURE && unitTemperature) {
                itemNew.value = this.metricTemperatureService.executeValue(item.value, { unitFrom: item.unit as METRIC_DISTANCE_UNIT, unitTo: unitTemperature })
                itemNew.unit = unitTemperature;
            }
            return itemNew;
        })

    }


}
