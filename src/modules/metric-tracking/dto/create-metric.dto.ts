import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateMetricDto {
    @ApiProperty()
    @IsString()
    value: number;

    @ApiProperty()
    @IsDateString()
    date: Date;

    @ApiProperty()
    @IsString()
    unit: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    userId: string;
}
