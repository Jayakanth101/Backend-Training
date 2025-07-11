import { ApiProperty } from '@nestjs/swagger';
import { ProjectMemberEntity } from '../project-member.entity';
import { ProjectMemberDto } from './project-member.dto';
import { ProjectMemberResponseDto } from './project-member-response.dto';
import { MembersProjectResponseDto } from './members-project-response.dto';

export class CreateProjectMemberSwaggerDto {
    @ApiProperty({ type: () => ProjectMemberEntity })
    project_member: ProjectMemberEntity;
}

export class ProjectMembersByProjectSwaggerDto {
    @ApiProperty({ type: () => [ProjectMemberResponseDto] })
    project_members: ProjectMemberResponseDto[];
}

export class MembersProjectsByUserSwaggerDto {
    @ApiProperty({ type: () => [MembersProjectResponseDto] })
    members_projects: MembersProjectResponseDto[];
}

export class UpdateProjectMemberSwaggerDto {
    @ApiProperty({ type: () => ProjectMemberDto })
    project_member: ProjectMemberDto;
}

export class DeleteProjectMemberSwaggerDto {
    @ApiProperty({ example: 'Membership removed successfully' })
    Message: string;
}

