import { Put, UsePipes, ValidationPipe, Body, Controller, Post, Get, Param, Delete, UseGuards } from "@nestjs/common";
import { ProjectEntity } from "./project.entity";
import { ProjectService } from "./project.service";
import { ProjectEntityDto } from "./dto/project.dto";
import { Roles } from "../../../src/custom-decorators/roles.decorator";
import { ProjectRolesGuard } from "../../../src/guards/project-role.guards";

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createProject(@Body() dto: ProjectEntityDto): Promise<{ project: ProjectEntity }> {
        return this.projectService.createProject(dto);
    }

    @Get(':id')
    async findProject(@Param('id') id: number): Promise<{ project: ProjectEntity }> {
        return this.projectService.findProject(id);
    }

    @Get()
    async findAllProjects(): Promise<{ projects: ProjectEntity[] }> {
        return this.projectService.findAllProjects();
    }

    @UseGuards(UseGuards, ProjectRolesGuard)
    @Roles('admin')
    @Roles('developers')
    @Roles('tester')
    @Put(':id')
    async updateProject(
        @Param('id') id: number,
        @Body() updated_project: ProjectEntityDto
    ): Promise<{ project: ProjectEntity, message: string }> {
        return await this.projectService.updateProject(id, updated_project);
    }

    @UseGuards(UseGuards, ProjectRolesGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteProject(@Param('id') id: number): Promise<{ message: string }> {
        return await this.projectService.deleteProject(id);
    }

}
