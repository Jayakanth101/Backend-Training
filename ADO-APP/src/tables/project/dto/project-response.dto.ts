import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from '../project.entity';

export class CreateProjectResponseDto {
    @ApiProperty({ type: () => ProjectEntity })
    project: ProjectEntity;
}

export class FindProjectResponseDto {
    @ApiProperty({ type: () => ProjectEntity })
    project: ProjectEntity;
}

export class FindAllProjectsResponseDto {
    @ApiProperty({ type: () => [ProjectEntity] })
    projects: ProjectEntity[];
}

export class UpdateProjectResponseDto {
    @ApiProperty({ type: () => ProjectEntity })
    project: ProjectEntity;

    @ApiProperty({ example: 'Project updated successfully' })
    message: string;
}

export class DeleteProjectResponseDto {
    @ApiProperty({ example: 'Project deleted successfully' })
    message: string;
}

