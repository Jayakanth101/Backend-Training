import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ProjectMemberService } from "./project-member.service";
import { ProjectMemberDto } from "./dto/project-member.dto";
import { ProjectMemberResponseDto } from "./dto/project-member-response.dtp";
import { MembersProjectResponseDto } from "./dto/members-project-response.dto";
import { UpdateProjectMemberRoleDto } from "./dto/project-member-role.dto";
import { ProjectMemberEntity } from "./project-member.entity";


@Controller('members')
export class ProjectMemberController {
    constructor(private readonly projectMemberService: ProjectMemberService) { }

    @Post()
    async createProjectMembership(@Body() dto: ProjectMemberDto):
        Promise<{ project_member: ProjectMemberEntity }> {
        return await this.projectMemberService.createProjectMember(dto);
    }

    @Get('project/:projectId')
    async getAllProjectMembers(@Param('projectId') projectId: number): Promise<{ project_members: ProjectMemberResponseDto[] }> {
        return await this.projectMemberService.getAllProjectMembers(projectId);

    }

    @Get('user/:userId')
    async getAllMembersProject(@Param('userId') userId: number): Promise<{ members_projects: MembersProjectResponseDto[] }> {
        return await this.projectMemberService.getAllMembersProject(userId);
    }

    @Put(':projectId/:userId')
    async updateProjectMembership(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() roleDto: UpdateProjectMemberRoleDto
    ): Promise<{ project_member: ProjectMemberDto }> {
        return await this.projectMemberService.updateProjectMembership(projectId, userId, roleDto);
    }

    @Delete(':projectId/:userId')
    async removeProjectMembership(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<{ Message: string }> {
        return await this.projectMemberService.removeProjectMembership(projectId, userId);
    }


}
