
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from './pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class FilterQuery extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort?: string;
}
