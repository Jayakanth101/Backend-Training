import { IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTagDto {
    @ApiPropertyOptional({
        example: [1, 2, 3],
        description: 'List of work item IDs to update the tag association with',
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    workitem_ids?: number[];
}

