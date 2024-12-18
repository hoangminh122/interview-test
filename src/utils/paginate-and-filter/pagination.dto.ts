import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationQuery {
  @ApiPropertyOptional({
    example: 1,
    type: 'number',
    description: 'Page number',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  readonly page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    type: 'number',
    description: 'Maximum per page',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  readonly limit?: number = 10;
}
