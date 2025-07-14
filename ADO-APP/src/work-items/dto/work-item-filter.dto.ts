import { IsOptional, IsString } from 'class-validator';
import { State, Type } from '../enum/work-items-enum';
import { Tags } from '../../tags/tag.entity';
import { Type as TypeNumber } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WorkItemFilterDto {
    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    id: number;

    @ApiProperty({ enum: Type, required: false })
    @IsOptional()
    type: Type;

    @ApiProperty({ example: 2, required: false })
    @IsOptional()
    @TypeNumber(() => Number)
    assigned_to: number;

    @ApiProperty({ enum: State, required: false })
    @IsOptional()
    state: State;

    @ApiProperty({ example: 'frontend/login', required: false })
    @IsOptional()
    area_path: string;

    @ApiProperty({ type: [Tags], required: false })
    @IsOptional()
    tags: Tags[];

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    recently_updated: boolean;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    recently_created: boolean;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    recently_completed: boolean;

    @ApiProperty({ example: 'login', required: false })
    @IsOptional()
    @IsString()
    keyword: string | null;
}

