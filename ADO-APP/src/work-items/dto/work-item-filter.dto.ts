import { IsOptional, IsString } from 'class-validator'
import { State, Type } from '../enum/work-items-enum';
import { Tags } from 'src/tags/tag.entity';

export class WorkItemFilterDto {
    @IsOptional()
    id?: number;

    @IsOptional()
    type?: Type;

    @IsOptional()
    assigned_to?: number;

    @IsOptional()
    state?: State;

    @IsOptional()
    area_path?: string;

    @IsOptional()
    tags?: Tags[]

    @IsOptional()
    recently_updated?: boolean;

    @IsOptional()
    recently_created?: boolean;

    @IsOptional()
    recently_completed?: boolean;

    @IsOptional()
    @IsString()
    keyword?: string;
}
