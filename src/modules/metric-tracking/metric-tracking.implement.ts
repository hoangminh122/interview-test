import { Injectable } from '@nestjs/common';
import { Repository } from 'src/repositories/repository';
import { BASE_ENTITY_DOMAIN, TABLE_NAMES } from 'src/utils/constants/common.constant';
import { GetMetricDto } from './dto/get-metric.dto';
import { Brackets } from 'typeorm';
import { IAliasMapping, QueryHandlerBuilder } from 'src/utils/customer-select-query-builder';
import { METRIC_DISTANCE_UNIT, METRIC_TEMPERATURE_UNIT, METRIC_TYPE } from 'src/utils/enums/tracking.enum';
import { Metric } from 'src/repositories/entities';
import { MetricLibService } from '@app/metric-lib/metric-lib.service';
import { SORT_DIRECTIONS } from 'src/utils/enums/common.enum';
import * as _ from 'lodash'
import { IMetricForChart } from 'src/utils/interfaces/model.interface';

@Injectable()
export class MetricTrackingImplementService {

    constructor(
        private readonly model: Repository,
        private metricDistanceService: MetricLibService,
        private metricTemperatureService: MetricLibService
    ) {
    }

    generateQueryBuilder(query: GetMetricDto, aliasMapping: IAliasMapping) {
        const builder = this.model.metricRepository.createCustomQueryBuilder(
            `${TABLE_NAMES.METRIC}`,
            query,
            aliasMapping,
        );

        // query type of Metric
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

        // query perios
        const periodQuery = query[`period`];
        return periodQuery ? this.latestMetricsForMonth(builder, periodQuery, typeQuery) : builder;
    }

    convertToUnit(data: Metric[], unitDistance: METRIC_DISTANCE_UNIT, unitTemperature: METRIC_TEMPERATURE_UNIT) {
        return data.map(item => {
            const itemNew = item;
            if (item.type === METRIC_TYPE.DISTANCE && unitDistance) {
                this.metricDistanceService.setInsDefault(METRIC_TYPE.DISTANCE);
                itemNew.value = this.metricDistanceService.executeValue(item.value, { unitFrom: item.unit as METRIC_DISTANCE_UNIT, unitTo: unitDistance })
                itemNew.unit = unitDistance;
            }
            if (item.type === METRIC_TYPE.TEMPERATURE && unitTemperature) {
                this.metricTemperatureService.setInsDefault(METRIC_TYPE.TEMPERATURE)
                itemNew.value = this.metricTemperatureService.executeValue(item.value, { unitFrom: item.unit as METRIC_TEMPERATURE_UNIT, unitTo: unitTemperature })
                itemNew.unit = unitTemperature;
            }
            return itemNew;
        })
    }

    convertToUnitForChart(data: Array<IMetricForChart>, unitDistance: METRIC_DISTANCE_UNIT, unitTemperature: METRIC_TEMPERATURE_UNIT) {
        return data.map(item => {
            let itemNew = item;
            const unitArray = itemNew.units.split(",");
            const unitLastest = _.last(unitArray)
            if (item.type === METRIC_TYPE.DISTANCE && unitDistance) {
                this.metricDistanceService.setInsDefault(METRIC_TYPE.DISTANCE);
                itemNew.value = this.metricDistanceService.executeValue(item.value, { unitFrom: unitLastest as METRIC_DISTANCE_UNIT, unitTo: unitDistance })
                itemNew.unit = unitDistance;
            }
            if (item.type === METRIC_TYPE.TEMPERATURE && unitTemperature) {
                this.metricTemperatureService.setInsDefault(METRIC_TYPE.TEMPERATURE)
                itemNew.value = this.metricTemperatureService.executeValue(item.value, { unitFrom: unitLastest as METRIC_TEMPERATURE_UNIT, unitTo: unitTemperature })
                itemNew.unit = unitTemperature;
            }

            delete itemNew.units;
            return itemNew;
        })
    }

    latestMetricsForMonth(builder: QueryHandlerBuilder<Metric, GetMetricDto>, periodNum: number = 1, type: METRIC_TYPE): QueryHandlerBuilder<Metric, GetMetricDto> {
        const result = builder
            .select([
                `DATE(${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.DATE}) AS date`,
                `MAX(${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.DATE}) AS latestTimestamp`,
                `MAX(${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.VALUE}) AS value`,
                `${TABLE_NAMES.METRIC}.${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.TYPE} AS ${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.TYPE}`,
                `GROUP_CONCAT(DISTINCT ${TABLE_NAMES.METRIC}.${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.UNIT})  AS units`
            ])
            .where(`${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.TYPE} = :type`, { type })
            .andWhere(`${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.DATE} >= NOW() - INTERVAL ${periodNum} MONTH`)
            .groupBy(`DATE(${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.DATE}), ${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.TYPE}`)
            .orderBy('latestTimestamp', SORT_DIRECTIONS.DESC)
        return result;
    }

}
