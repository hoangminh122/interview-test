import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/_core/controller.base';
import { ENDPOINT_PATH } from 'src/utils/constants/endpoint-path.constant';

import { MetricTrackingService } from './metric-tracking.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { GetMetricDto } from './dto/get-metric.dto';

@ApiTags(ENDPOINT_PATH.METRIC_TRACKING.BASE)
@Controller(`${ENDPOINT_PATH.METRIC_TRACKING.BASE}`)
export class MetricTrackingController extends BaseController {
    constructor(private readonly metricTrackingService: MetricTrackingService) {
        super();
    }

    @Post(ENDPOINT_PATH.BASE.USER_ID)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Param('user_id') userId: string,
        @Body() payload: CreateMetricDto,
    ) {
        const response = await this.metricTrackingService.create(
            payload, userId
        );
        return this.successResponse(response);
        return 1
    }

    @Get()
    async getMany(
        @Query() queryDto: GetMetricDto,
        @Param('user_id') userId: string,
    ) {
        const { data, paging } = await this.metricTrackingService.getMany(
            queryDto,
            userId,
        );
        return this.pagingResponse(data, paging);
    }
}
