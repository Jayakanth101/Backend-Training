import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type as TransformType, Type as NestedType } from 'class-transformer'
import { Type, State } from '../enum/work-items-enum';
import { CreatePlanningDto } from 'src/planning/dto/planning.dto';

export class CreateWorkItemDto {

    @IsNotEmpty()
    @IsEnum(Type)
    type: Type;

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
    createdby: number;

    @IsString()
    description: string;

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
    parentid: number;

    @IsOptional()
    @ValidateNested()
    @NestedType(() => CreatePlanningDto)
    planning: CreatePlanningDto;

    constructor(partial: Partial<CreateWorkItemDto>) {
        Object.assign(this, partial);
        if (!this.iteration) {
            this.iteration = this.area_path;
        }
    }
}

