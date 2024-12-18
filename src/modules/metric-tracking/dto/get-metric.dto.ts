import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { METRIC_TYPE } from 'src/utils/enums/tracking.enum';
import { FilterQuery } from 'src/utils/paginate-and-filter/filter.dto';

export class GetMetricDto extends FilterQuery {
  @ApiPropertyOptional({
    description: 'Metric type',
    isArray: false,
    default: METRIC_TYPE.DISTANCE,
    enum: METRIC_TYPE,
  })
  @IsEnum(METRIC_TYPE, { each: false })
  type: METRIC_TYPE;


}
