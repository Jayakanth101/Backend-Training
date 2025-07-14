import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDiscussionDto {
    @ApiPropertyOptional({ example: 'Updated comment message' })
    @IsOptional()
    @IsString()
    message?: string;

    @ApiPropertyOptional({ example: '2025-07-11T12:00:00Z' })
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    createdat?: Date;
}

