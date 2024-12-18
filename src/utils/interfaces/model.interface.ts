export interface ISoftDeletable {
  deletedAt?: Date;
}

export interface IMetricForChart {
  date: Date, latestTimestamp: Date, value: number, type: string, units: string, unit: string
}
