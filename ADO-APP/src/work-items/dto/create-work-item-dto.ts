import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type as TransformType, Type as NestedType } from 'class-transformer'
import { Type, State } from '../enum/work-items-enum';
import { CreatePlanningDto } from '../../planning/dto/planning.dto';
import { Tags } from '../../../src/tags/tag.entity';

export class CreateWorkItemDto {

    @IsNotEmpty()
    @IsEnum(Type)
    type: Type;

    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsEnum(State)
    state: State;

    @IsNotEmpty()
    @IsString()
    area_path: string;

    @IsOptional()
    @IsString()
    iteration: string;

    @IsNotEmpty()
    @IsNumber()
    created_by: number;

    @IsString()
    description: string;

    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    updated_at: Date;

    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    created_at: Date;


    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    completed_at: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    assigned_to: number;

    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    activity_date: Date;

    @IsNotEmpty()
    @IsString()
    classification: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    parentid: number | null;

    @IsOptional()
    @ValidateNested()
    @NestedType(() => CreatePlanningDto)
    planning: CreatePlanningDto | null;

    @IsOptional()
    @IsNumber()
    sprint_id: number;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    tag_ids: number[];


    constructor(partial: Partial<CreateWorkItemDto>) {
        Object.assign(this, partial);
        if (!this.iteration) {
            this.iteration = this.area_path;
        }
    }
}
