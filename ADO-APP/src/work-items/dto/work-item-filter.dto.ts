import { IsOptional, IsString } from 'class-validator'
import { State, Type } from '../enum/work-items-enum';
import { Tags } from '../../tags/tag.entity';
import { Type as TypeNumber } from 'class-transformer';

export class WorkItemFilterDto {
    @IsOptional()
    id: number;

    @IsOptional()
    type: Type;

    @IsOptional()
    @TypeNumber(() => Number)
    assigned_to: number;

    @IsOptional()
    state: State;

    @IsOptional()
    area_path: string;

    @IsOptional()
    tags: Tags[]

    @IsOptional()
    recently_updated: boolean;

    @IsOptional()
    recently_created: boolean;

    @IsOptional()
    recently_completed: boolean;

    @IsOptional()
    @IsString()
    keyword: string | null;
}
