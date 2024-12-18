import { Injectable } from "@nestjs/common";
import { FormulaConvertUnitFunction, IMetricUnitService } from "./metric-unit.interface";
import { DISTANCE_CONVERSION_RATES, METRIC_DISTANCE_UNIT, METRIC_TEMPERATURE_UNIT } from "./constant";

export const distanceFormulaFunction:
  | FormulaConvertUnitFunction = (
    value: number,
    option: {
      unitFrom: METRIC_DISTANCE_UNIT;
      unitTo: METRIC_DISTANCE_UNIT;
    },
  ) => {
    const { unitFrom, unitTo } = option

    if (!DISTANCE_CONVERSION_RATES[unitFrom] || !DISTANCE_CONVERSION_RATES[unitFrom][unitTo]) {
      throw new Error('Invalid unit conversion');
    }
    return value * DISTANCE_CONVERSION_RATES[unitFrom][unitTo];
  };

@Injectable()
export class MetricDistanceService implements IMetricUnitService {
  formulaConvertUnitFn: FormulaConvertUnitFunction;

  constructor(formulaConvertUnitFn: FormulaConvertUnitFunction) {
    if (formulaConvertUnitFn) {
      this.formulaConvertUnitFn = formulaConvertUnitFn;
    }
  }

  executeValue(value: number, option: { unitFrom: METRIC_DISTANCE_UNIT; unitTo: METRIC_DISTANCE_UNIT; }): number {
    try {
      return this.formulaConvertUnitFn(
        value,
        option
      );
    } catch (error) {
      throw error;
    }
  }
}
