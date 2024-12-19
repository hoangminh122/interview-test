import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { MetricTrackingService } from './metric-tracking.service';
import { MetricTrackingImplementService } from './metric-tracking.implement';
import { MetricRepository } from 'src/repositories';
import { MetricLibService } from '@app/metric-lib/metric-lib.service';
import { distanceFormulaFunction, MetricDistanceService } from '@app/metric-lib/metric-unit/metric-distance-unit.service';
import { MetricTemperatureService, temperatureFormulaFunction } from '@app/metric-lib/metric-unit/metric-temperature-unit.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { GetMetricDto } from './dto/get-metric.dto';
import { Pagination } from 'src/utils/interfaces/success-response';
import { METRIC_TYPE, METRIC_DISTANCE_UNIT, METRIC_TEMPERATURE_UNIT } from 'src/utils/enums/tracking.enum';
import * as _ from 'lodash';
import { BadRequestException } from '@nestjs/common';
import { SYSTEM_ERROR_CODE } from 'src/utils/constants/system.constant';
import { Repository } from 'src/repositories/repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

jest.mock('./metric-tracking.implement.ts'); // Mock the implementation service

describe('MetricTrackingService', () => {
  let service: MetricTrackingService;
  let metricTrackingImplementService: MetricTrackingImplementService;
  let metricRepository: MetricRepository;
  let eventEmitter: EventEmitter2;
  let model: Repository;
  let req: Request;
  const dtoTest: CreateMetricDto = {
    value: 0,
    date: new Date("2024-12-18T21:59:53.824Z"),
    unit: METRIC_TEMPERATURE_UNIT.K,
    userId: "596873b3-edb5-495d-91e9-1fd84cbf7794"
  };

  const arrMetricTest = [
    {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "e8bd526b-2a6b-4ac0-b9f5-c1a854e47162",
      updatedBy: null,
      id: "31caa507-a552-4177-8b04-3722395de11c",
      userId: "e8bd526b-2a6b-4ac0-b9f5-c1a854e47162",
      type: METRIC_TYPE.TEMPERATURE,
      date: new Date(),
      value: 12.00,
      unit: METRIC_TEMPERATURE_UNIT.C
    },
    {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "e8bd526b-2a6b-4ac0-b9f5-c1a854e47162",
      updatedBy: null,
      id: "af59688d-4f8f-4ce9-bfb4-720477b2ca9f",
      userId: "e8bd526b-2a6b-4ac0-b9f5-c1a854e47162",
      type: METRIC_TYPE.DISTANCE,
      date: new Date(),
      value: 132,
      unit: METRIC_DISTANCE_UNIT.METER
    }
  ];

  beforeEach(() => {
    metricTrackingImplementService = new MetricTrackingImplementService(
      {} as any, // Mock the repository
      new MetricLibService(new MetricDistanceService(distanceFormulaFunction), new MetricTemperatureService(temperatureFormulaFunction)),
      new MetricLibService(new MetricDistanceService(distanceFormulaFunction), new MetricTemperatureService(temperatureFormulaFunction))
    );

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

    req = {
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
    } as unknown as Request;

    service = new MetricTrackingService(
      model, req, eventEmitter,
      metricTrackingImplementService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMany', () => {
    it('should return paginated metrics and total count', async () => {
      const queryDto: GetMetricDto = {
        type: METRIC_TYPE.DISTANCE,
        unitDistance: null,
        unitTemperature: null,
        limit: 1,
        page: 10
      };
      const userIdLoginFake = 'e8bd526b-2a6b-4ac0-b9f5-c1a854e47162';

      const mockMetrics = arrMetricTest;

      const mockPagination: Pagination = {
        maxPerPage: 10,
        pageNumber: 1,
        totalItem: 2,
        totalPage: 1
      };

      // Mock `generateQueryBuilder` method
      const mockBuilder: any = {
        getManyAndCount: jest.fn().mockResolvedValue([mockMetrics, 2]),
        paginate: jest.fn().mockReturnValue(mockPagination),
      };

      metricTrackingImplementService.generateQueryBuilder = jest.fn().mockReturnValue(mockBuilder);

      // Mock `convertToUnit` to return the mock metrics
      (metricTrackingImplementService.convertToUnit as jest.Mock).mockReturnValue(mockMetrics);

      const result = await service.getMany(queryDto, userIdLoginFake);

      expect(result).toEqual(mockPagination);
      expect(mockBuilder.getManyAndCount).toHaveBeenCalledWith();
      expect(mockBuilder.paginate).toHaveBeenCalledWith(mockMetrics, 2);
    });
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
