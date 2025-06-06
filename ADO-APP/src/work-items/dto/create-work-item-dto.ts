import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Type as TransformType } from 'class-transformer'
import { Type, State } from '../enum/work-items-enum';

export class CreateWorkItemDto {

    @IsNotEmpty()
    @IsNumber()
    id: number;

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

    @IsNotEmpty()
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

    @IsNotEmpty()
    @IsNumber()
    parentid: number;

}

