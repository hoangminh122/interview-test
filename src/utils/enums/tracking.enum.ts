import * as _ from 'lodash';

export enum METRIC_DISTANCE_UNIT {
  METER = 'Meter',
  CENTIMETER = 'centimeter',
  INCH = 'inch',
  FEET = 'feet',
  YARD = 'yard',
}

export enum METRIC_TEMPERATURE_UNIT {
  C = 'C',
  F = 'F',
  K = 'K',
}

export enum METRIC_TYPE {
  DISTANCE = 'DISTANCE',
  TEMPERATURE = 'TEMPERATURE',
}

export const METRIC_UNIT = _.assign(
  {},
  METRIC_DISTANCE_UNIT,
  METRIC_TEMPERATURE_UNIT,
);
