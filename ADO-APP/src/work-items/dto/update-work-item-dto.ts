import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkItemDto } from './create-work-item-dto';
import { CreatePlanningDto } from '../../planning/dto/planning.dto';
import { Type as TransformType } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkItemDto extends PartialType(CreateWorkItemDto) {
    @ApiProperty({ type: () => CreatePlanningDto, required: false })
    @TransformType(() => CreatePlanningDto)
    planning?: CreatePlanningDto | null;
}

