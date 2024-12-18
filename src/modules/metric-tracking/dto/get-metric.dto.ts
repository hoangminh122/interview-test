import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { METRIC_DISTANCE_UNIT, METRIC_TEMPERATURE_UNIT, METRIC_TYPE } from 'src/utils/enums/tracking.enum';
import { FilterQuery } from 'src/utils/paginate-and-filter/filter.dto';
import { PaginationQuery } from 'src/utils/paginate-and-filter/pagination.dto';

export class GetMetricDto extends PaginationQuery {
  @ApiPropertyOptional({
    description: 'Metric type',
    isArray: false,
    default: METRIC_TYPE.DISTANCE,
    enum: METRIC_TYPE,
  })
  @IsEnum(METRIC_TYPE, { each: false })
  @IsNotEmpty()
  type: METRIC_TYPE;

  @ApiPropertyOptional({
    description: 'Unit distance type',
    isArray: false,
    default: METRIC_DISTANCE_UNIT.METER,
    enum: METRIC_DISTANCE_UNIT,
  })
  @IsOptional()
  @IsEnum(METRIC_DISTANCE_UNIT, { each: false })
  unitDistance: METRIC_DISTANCE_UNIT;

  @ApiPropertyOptional({
    description: 'Unit temperature type',
    isArray: false,
    default: METRIC_TEMPERATURE_UNIT.K,
    enum: METRIC_TEMPERATURE_UNIT,
  })
  @IsOptional()
  @IsEnum(METRIC_TEMPERATURE_UNIT, { each: false })
  unitTemperature: METRIC_TEMPERATURE_UNIT;
}

export class GetMetricForChartDto extends GetMetricDto {
  @ApiProperty({
    description: 'Metric type',
    isArray: false,
    default: METRIC_TYPE.DISTANCE,
    enum: METRIC_TYPE,
  })
  @IsEnum(METRIC_TYPE, { each: false })
  @IsNotEmpty()
  type: METRIC_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  // @IsNumber()
  period: number;
}
