import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
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
    @TransformType(() => Date)
    @IsDate()
    startdate: Date;

    @IsNotEmpty()
    @IsNumber()
    createdby: number;

    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    targetdate: Date;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    assignto: number;

    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    activitydate: Date;

    @IsNotEmpty()
    @IsString()
    areapath: string;

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
}

