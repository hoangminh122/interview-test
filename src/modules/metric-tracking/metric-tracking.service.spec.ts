import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { MetricTrackingService } from './metric-tracking.service';
import { Repository } from 'src/repositories/repository';
import { MetricRepository } from 'src/repositories';
import { MetricTrackingImplementService } from './metric-tracking.implement';
import { MetricLibService } from '@app/metric-lib/metric-lib.service';
import { IMetricUnitService } from '@app/metric-lib/metric-unit/metric-unit.interface';
import { distanceFormulaFunction, MetricDistanceService } from '@app/metric-lib/metric-unit/metric-distance-unit.service';
import { MetricTemperatureService, temperatureFormulaFunction } from '@app/metric-lib/metric-unit/metric-temperature-unit.service';
import { METRIC_TYPE } from '@app/metric-lib/metric-unit/constant';
import { CreateMetricDto } from './dto/create-metric.dto';
import * as _ from 'lodash'
import { METRIC_DISTANCE_UNIT } from 'src/utils/enums/tracking.enum';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { SYSTEM_ERROR_CODE } from 'src/utils/constants/system.constant';
const dtoTest: CreateMetricDto = {
  value: 0,
  date: new Date("2024-12-18T21:59:53.824Z"),
  unit: "K",
  userId: "596873b3-edb5-495d-91e9-1fd84cbf7794"
};

describe('MetricTrackingService', () => {
  let service: MetricTrackingService;
  let metricRepository: MetricRepository;
  let eventEmitter: EventEmitter2;
  let model: Repository;
  let req: Request;
  let metricTrackingImplementService: MetricTrackingImplementService;
  let metricDistanceService: MetricLibService;
  let metricTemperatureService: MetricLibService;

  beforeEach(() => {
    metricRepository = {
      insertOne: jest
        .fn()
        .mockResolvedValue([
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: dtoTest.userId,
            updatedBy: null,
            id: "fdae1f72-0ac2-48f4-a689-0fc2a37d926d",
            userId: dtoTest.userId,
            type: Object.values(METRIC_DISTANCE_UNIT).some(
              (distanceItem) => distanceItem === dtoTest.unit,
            )
              ? METRIC_TYPE.DISTANCE
              : METRIC_TYPE.TEMPERATURE,
            date: dtoTest.date,
            value: dtoTest.value,
            unit: dtoTest.unit
          }
        ]),
    } as unknown as MetricRepository;


    eventEmitter = {
      emit: jest.fn(),
    } as unknown as EventEmitter2;

    req = {
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
    } as unknown as Request;

    model = {
      metricRepository,
    } as unknown as Repository;

    metricDistanceService = new MetricLibService(new MetricDistanceService(distanceFormulaFunction), new MetricTemperatureService(temperatureFormulaFunction))
    metricDistanceService.setInsDefault(METRIC_TYPE.DISTANCE)

    metricTemperatureService = new MetricLibService(new MetricDistanceService(distanceFormulaFunction), new MetricTemperatureService(temperatureFormulaFunction))
    metricTemperatureService.setInsDefault(METRIC_TYPE.TEMPERATURE)

    metricTrackingImplementService = new MetricTrackingImplementService(model, metricDistanceService, metricTemperatureService);
    service = new MetricTrackingService(model, req, eventEmitter, metricTrackingImplementService);
  });

  describe('create', () => {
    it('create success', async () => {
      const result = await service.create(dtoTest, dtoTest.userId);
      expect(_.first(result).userId).toEqual(dtoTest.userId);
    });

    it('create fail if unit diff [Meter,centimeter,inch,feet,yard,C,F,K]', async () => {
      dtoTest.unit = "ABC";
      await expect(service.create(dtoTest, dtoTest.userId)).rejects.toThrowError(
        new BadRequestException(SYSTEM_ERROR_CODE.METRIC_TRACKING.UNIT_BAD_REQUEST),
      );
    });
  });
});
