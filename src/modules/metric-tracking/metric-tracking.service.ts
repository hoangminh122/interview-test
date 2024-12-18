import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { LoggerService } from 'src/modules/base/logger/logger.base.service';
import { Metric } from 'src/repositories/entities';
import { Repository } from 'src/repositories/repository';
import { CreateMetricDto } from './dto/create-metric.dto';
import { Brackets, DeepPartial } from 'typeorm';
import {
    METRIC_DISTANCE_UNIT,
    METRIC_TYPE,
} from 'src/utils/enums/tracking.enum';
import { Pagination } from 'src/utils/interfaces/success-response';
import { BASE_ENTITY_DOMAIN, TABLE_NAMES } from 'src/utils/constants/common.constant';
import { GetMetricDto } from './dto/get-metric.dto';
import { IAliasMapping } from 'src/utils/customer-select-query-builder';
import { MetricTrackingImplementService } from './metric-tracking.implement';
import { MetricLibService } from '@app/metric-lib/metric-lib.service';

@Injectable()
export class MetricTrackingService extends LoggerService {
    constructor(
        private model: Repository,
        @Inject(REQUEST) public readonly req: Request,
        eventEmitter: EventEmitter2,
        private metricTrackingImplementService: MetricTrackingImplementService,
        // private metricLibService: MetricLibService,
    ) {
        super(req, eventEmitter);
    }

    async create(
        payload: CreateMetricDto,
        userIdLoginFake: string,
    ): Promise<DeepPartial<Metric>> {
        this.log(
            `[${MetricTrackingService.name}][create]: create => ${JSON.stringify(payload)}`,
        );

        const { userId, unit } = payload;
        const type = Object.values(METRIC_DISTANCE_UNIT).some(
            (distanceItem) => distanceItem === unit,
        )
            ? METRIC_TYPE.DISTANCE
            : METRIC_TYPE.TEMPERATURE;
        const result = await this.model.metricRepository.insertOne({
            ...payload,
            type,
            userId: userId ?? userIdLoginFake,
            createdBy: userId,
        });
        return result;
    }

    async getMany(
        queryDto: GetMetricDto,
        userIdLoginFake: string,
    ): Promise<{ data: Metric[]; paging: Pagination }> {
        this.log(
            `[${MetricTrackingService.name}][getMany]: getMany => ${JSON.stringify(queryDto)} by ${userIdLoginFake}`,
        );
        const { unitDistance, unitTemperature } = queryDto;

        const aliasMapping: IAliasMapping = {
            id: `${TABLE_NAMES.METRIC}.${BASE_ENTITY_DOMAIN.BASE_COLUMNS.ID}`,
            type: `${TABLE_NAMES.METRIC}.${BASE_ENTITY_DOMAIN.METRIC_COLUMNS.TYPE}`,
        };

        const builder = this.metricTrackingImplementService.generateQueryBuilder(queryDto, aliasMapping)

        const [metrics, totalItem] = await builder.getManyAndCount()

        const results = this.metricTrackingImplementService.convertToUnit(metrics, unitDistance, unitTemperature)
        return builder.paginate(results, totalItem);
    }
}

