import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/_core/controller.base';
import { ENDPOINT_PATH } from 'src/utils/constants/endpoint-path.constant';

import { MetricTrackingService } from './metric-tracking.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { GetMetricDto } from './dto/get-metric.dto';
import { UserLoginFakeDto } from './dto/user-login-fake.dto';

@ApiTags(ENDPOINT_PATH.METRIC_TRACKING.BASE)
@Controller(`${ENDPOINT_PATH.METRIC_TRACKING.BASE}`)
export class MetricTrackingController extends BaseController {
    constructor(private readonly metricTrackingService: MetricTrackingService) {
        super();
    }

    @Post(ENDPOINT_PATH.BASE.USER_ID_LOGIN_FAKE)
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe())
    async create(
        @Param() userLoginFakeDto: UserLoginFakeDto,
        @Body() payload: CreateMetricDto,
    ) {
        const response = await this.metricTrackingService.create(
            payload, userLoginFakeDto.userIdLoginFake
        );
        return this.successResponse(response);
    }

    @Get(ENDPOINT_PATH.BASE.USER_ID_LOGIN_FAKE)
    @UsePipes(new ValidationPipe())
    async getMany(
        @Query() queryDto: GetMetricDto,
        @Param() userLoginFakeDto: UserLoginFakeDto,
    ) {
        const { data, paging } = await this.metricTrackingService.getMany(
            queryDto,
            userLoginFakeDto.userIdLoginFake
        );
        return this.pagingResponse(data, paging);
    }
}
