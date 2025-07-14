import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { ProjectMemberDto } from './dto/project-member.dto';
import { ProjectMemberResponseDto } from './dto/project-member-response.dto';
import { MembersProjectResponseDto } from './dto/members-project-response.dto';
import { UpdateProjectMemberRoleDto } from './dto/project-member-role.dto';
import { ProjectMemberEntity } from './project-member.entity';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiBearerAuth
} from '@nestjs/swagger';
import {
    CreateProjectMemberSwaggerDto,
    ProjectMembersByProjectSwaggerDto,
    MembersProjectsByUserSwaggerDto,
    UpdateProjectMemberSwaggerDto,
    DeleteProjectMemberSwaggerDto,
} from './dto/response-swagger.dto';

@ApiTags('4. Project member creation')
@Controller('members')
export class ProjectMemberController {
    constructor(private readonly projectMemberService: ProjectMemberService) { }

    @ApiOperation({ summary: 'Create a new project member' })
    @ApiCreatedResponse({ description: 'Project member created', type: CreateProjectMemberSwaggerDto })
    @ApiBearerAuth('access-token')
    @Post()
    async createProjectMembership(
        @Body() dto: ProjectMemberDto,
    ): Promise<{ project_member: ProjectMemberEntity }> {
        return await this.projectMemberService.createProjectMember(dto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all members of a project' })
    @ApiOkResponse({ description: 'Project members fetched', type: ProjectMembersByProjectSwaggerDto })
    @Get('project/:projectId')
    async getAllProjectMembers(
        @Param('projectId') projectId: number,
    ): Promise<{ project_members: ProjectMemberResponseDto[] }> {
        return await this.projectMemberService.getAllProjectMembers(projectId);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all projects a user is part of' })
    @ApiOkResponse({ description: 'Projects for user fetched', type: MembersProjectsByUserSwaggerDto })
    @Get('user/:userId')
    async getAllMembersProject(
        @Param('userId') userId: number,
    ): Promise<{ members_projects: MembersProjectResponseDto[] }> {
        return await this.projectMemberService.getAllMembersProject(userId);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update role of a project member' })
    @ApiOkResponse({ description: 'Project member role updated', type: UpdateProjectMemberSwaggerDto })
    @Put(':projectId/:userId')
    async updateProjectMembership(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() roleDto: UpdateProjectMemberRoleDto,
    ): Promise<{ project_member: ProjectMemberDto }> {
        return await this.projectMemberService.updateProjectMembership(projectId, userId, roleDto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Remove a user from a project' })
    @ApiOkResponse({ description: 'Project membership removed', type: DeleteProjectMemberSwaggerDto })
    @Delete(':projectId/:userId')
    async removeProjectMembership(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<{ Message: string }> {
        return await this.projectMemberService.removeProjectMembership(projectId, userId);
    }
}

