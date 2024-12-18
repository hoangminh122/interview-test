import { Module } from '@nestjs/common';
import { MetricLibService } from './metric-lib.service';
import { PROVIDE_NAME } from './metric-unit/constant';
import { distanceFormulaFunction, MetricDistanceService } from './metric-unit/metric-distance-unit.service';
import { MetricTemperatureService, temperatureFormulaFunction } from './metric-unit/metric-temperature-unit.service';

@Module({
  providers: [  //trading
    {
      provide: PROVIDE_NAME.IMETRIC_DISTANCE,
      useFactory: () => {
        return new MetricDistanceService(distanceFormulaFunction);
      },
    },
    {
      provide: PROVIDE_NAME.IMETRIC_TEMPERATURE,
      useFactory: () => {
        return new MetricTemperatureService(temperatureFormulaFunction);
      },
    },
    MetricLibService],
  exports: [MetricLibService],
})
export class MetricLibModule { }
