import {
    IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber,
    IsOptional, IsString, ValidateNested,
} from 'class-validator';
import {
    Type as TransformType,
    Type as NestedType,
} from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Type, State } from '../enum/work-items-enum';
import { CreatePlanningDto } from '../../planning/dto/planning.dto';

export class CreateWorkItemDto {
    @ApiProperty({ enum: Type, example: Type.Task })
    @IsNotEmpty()
    @IsEnum(Type)
    type: Type;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @ApiProperty({ example: 'Fix login issue' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ enum: State, example: State.New })
    @IsNotEmpty()
    @IsEnum(State)
    state: State;

    @ApiProperty({ example: 'frontend/login' })
    @IsNotEmpty()
    @IsString()
    area_path: string;

    @ApiProperty({ example: 'frontend/login', required: false })
    @IsOptional()
    @IsString()
    iteration: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    created_by: number;

    @ApiProperty({ example: 'Login not working for certain users' })
    @IsString()
    description: string;

    @ApiProperty({ type: Date })
    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    updated_at: Date;

    @ApiProperty({ type: Date })
    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    created_at: Date;

    @ApiProperty({ type: Date })
    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    completed_at: Date;

    @ApiProperty({ example: 2, required: false })
    @IsOptional()
    @IsNumber()
    assigned_to: number;

    @ApiProperty({ type: Date })
    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    activity_date: Date;

    @ApiProperty({ example: 'Bug' })
    @IsNotEmpty()
    @IsString()
    classification: string;

    @ApiProperty({ example: 5, required: false })
    @IsOptional()
    @IsNumber()
    parentid: number | null;

    @ApiProperty({ type: () => CreatePlanningDto, required: false })
    @IsOptional()
    @ValidateNested()
    @NestedType(() => CreatePlanningDto)
    planning: CreatePlanningDto | null;

    @ApiProperty({ example: 3, required: false })
    @IsOptional()
    @IsNumber()
    sprint_id: number;

    @ApiProperty({ example: [1, 2], required: false })
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

