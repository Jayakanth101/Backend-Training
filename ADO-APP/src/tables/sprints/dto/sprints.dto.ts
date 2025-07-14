import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SprintDto {
    @ApiProperty({ example: 'Sprint 1' })
    @IsNotEmpty()
    @IsString()
    sprint_name: string;

    @ApiProperty({ example: '2025-07-10T09:00:00Z' })
    @IsNotEmpty()
    @IsDateString()
    start_date: Date;

    @ApiProperty({ example: '2025-07-20T18:00:00Z' })
    @IsNotEmpty()
    @IsDateString()
    end_date: Date;

    @ApiProperty({ example: 'Chennai' })
    @IsString()
    location: string;
}

