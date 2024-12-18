import { Injectable } from "@nestjs/common";
import { FormulaConvertUnitFunction, IMetricUnitService } from "./metric-unit.interface";
import { DISTANCE_CONVERSION_RATES, METRIC_TEMPERATURE_UNIT } from "./constant";

export const temperatureFormulaFunction:
  | FormulaConvertUnitFunction = (
    value: number,
    option: {
      unitFrom: METRIC_TEMPERATURE_UNIT;
      unitTo: METRIC_TEMPERATURE_UNIT;
    },
  ) => {
    const { unitFrom, unitTo } = option

    if (unitFrom === unitTo) return value;
    if (unitFrom === METRIC_TEMPERATURE_UNIT.C) {
      if (unitTo === METRIC_TEMPERATURE_UNIT.F) {
        return (value * 9) / 5 + 32;
      } else if (unitTo === METRIC_TEMPERATURE_UNIT.K) {
        return value + 273.15;
      }
    } else if (unitFrom === METRIC_TEMPERATURE_UNIT.F) {
      if (unitTo === METRIC_TEMPERATURE_UNIT.C) {
        return ((value - 32) * 5) / 9;
      } else if (unitTo === METRIC_TEMPERATURE_UNIT.K) {
        return ((value - 32) * 5) / 9 + 273.15;
      }
    } else if (unitFrom === METRIC_TEMPERATURE_UNIT.K) {
      if (unitTo === METRIC_TEMPERATURE_UNIT.C) {
        return value - 273.15;
      } else if (unitTo === METRIC_TEMPERATURE_UNIT.F) {
        return ((value - 273.15) * 9) / 5 + 32;
      }
    }
    throw new Error('Invalid unit conversion');
  };

@Injectable()
export class MetricTemperatureService implements IMetricUnitService {
  formulaConvertUnitFn: FormulaConvertUnitFunction;

  constructor(formulaConvertUnitFn: FormulaConvertUnitFunction) {
    if (formulaConvertUnitFn) {
      this.formulaConvertUnitFn = formulaConvertUnitFn;
    }
  }

  executeValue(value: number, option: { unitFrom: METRIC_TEMPERATURE_UNIT; unitTo: METRIC_TEMPERATURE_UNIT; }): number {
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
