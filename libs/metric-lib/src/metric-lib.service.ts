import { Inject, Injectable } from '@nestjs/common';
import { isNaN, isNumber, toString } from 'lodash';
import { IMetricUnitService } from './metric-unit/metric-unit.interface';
import { METRIC_DISTANCE_UNIT, METRIC_TEMPERATURE_UNIT, METRIC_TYPE, PROVIDE_NAME } from './metric-unit/constant';

@Injectable()
export class MetricLibService {
    private metricUnitServiceIns: IMetricUnitService;
    constructor(
        @Inject(PROVIDE_NAME.IMETRIC_DISTANCE)
        private metricDistanceService: IMetricUnitService,
        @Inject(PROVIDE_NAME.IMETRIC_TEMPERATURE)
        private metricTemperatureService: IMetricUnitService,
    ) { }


    setCustomize(metricUnitService: IMetricUnitService) {
        this.metricUnitServiceIns = metricUnitService;
        return true;
    }

    getIns() {
        if (!this.metricUnitServiceIns) {
            throw new Error("Instance not found");
        }
        return this.metricUnitServiceIns;
    }

    setInsDefault(type: METRIC_TYPE) {
        switch (type) {
            case METRIC_TYPE.DISTANCE:
                this.metricUnitServiceIns = this.metricDistanceService;
                break;
            case METRIC_TYPE.TEMPERATURE:
                this.metricUnitServiceIns = this.metricTemperatureService;
                break;
        }
        return true;
    }


    executeValue(value: number, option: { unitFrom: METRIC_TEMPERATURE_UNIT | METRIC_DISTANCE_UNIT; unitTo: METRIC_TEMPERATURE_UNIT | METRIC_DISTANCE_UNIT; }): number {
        if (!this.metricUnitServiceIns) {
            throw new Error("Instance not found");
        }
        return this.metricUnitServiceIns.executeValue(value, option)
    }
}
