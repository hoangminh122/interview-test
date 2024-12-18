import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMetricDto {
    @ApiProperty()
    @IsNumber()
    value: number;

    @ApiProperty()
    @IsDateString()
    date: Date;

    @ApiProperty()
    @IsString()
    unit: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    userId: string;
}
