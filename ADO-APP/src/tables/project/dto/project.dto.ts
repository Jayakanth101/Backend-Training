import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectMemberDto } from '../../../tables/project-member/dto/project-member.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectEntityDto {
    @ApiProperty({
        description: 'Name of the project',
        example: 'AI Research Platform',
    })
    @IsString()
    @IsNotEmpty()
    project_name: string;

    @ApiProperty({
        description: 'Optional description of the project',
        example: 'A platform to manage and deploy AI research pipelines',
        required: false,
    })
    @IsString()
    @IsOptional()
    project_description?: string;

    @ApiProperty({
        description: 'User ID of the project creator',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    project_creator_id: number;

    @ApiProperty({
        description: 'Optional array of project members',
        type: () => [ProjectMemberDto],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProjectMemberDto)
    members?: ProjectMemberDto[];
}

