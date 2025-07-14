import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSprintDto {
    @ApiPropertyOptional({ example: 'Updated Sprint Name' })
    @IsOptional()
    @IsString()
    sprint_name?: string;

    @ApiPropertyOptional({ example: '2025-07-12T10:00:00Z' })
    @IsOptional()
    @IsDateString()
    start_date?: Date;

    @ApiPropertyOptional({ example: '2025-07-25T18:00:00Z' })
    @IsOptional()
    @IsDateString()
    end_date?: Date;

    @ApiPropertyOptional({ example: 'Bangalore' })
    @IsOptional()
    @IsString()
    location?: string;
}

