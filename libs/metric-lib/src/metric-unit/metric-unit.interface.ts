import { METRIC_DISTANCE_UNIT, METRIC_TEMPERATURE_UNIT } from "./constant";

export type FormulaConvertUnitFunction = (
  value: number,
  option: {
    unitFrom: METRIC_TEMPERATURE_UNIT | METRIC_DISTANCE_UNIT;
    unitTo: METRIC_TEMPERATURE_UNIT | METRIC_DISTANCE_UNIT;
  },
) => number;

export interface IMetricUnitService {
  executeValue(
    value: number,
    option: {
      unitFrom: METRIC_TEMPERATURE_UNIT | METRIC_DISTANCE_UNIT;
      unitTo: METRIC_TEMPERATURE_UNIT | METRIC_DISTANCE_UNIT;
    },
  ): number;
  formulaConvertUnitFn: FormulaConvertUnitFunction;
}
