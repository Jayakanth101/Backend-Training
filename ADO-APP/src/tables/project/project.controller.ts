import { Put, UsePipes, ValidationPipe, Body, Controller, Post, Get, Param, Delete } from "@nestjs/common";
import { ProjectEntity } from "./project.entity";
import { ProjectService } from "./project.service";
import { ProjectEntityDto } from "./dto/project.dto";

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createProject(@Body() dto: ProjectEntityDto): Promise<ProjectEntity> {
        return this.projectService.createProject(dto);
    }

    @Get(':id')
    async findProject(@Param('id') id: number): Promise<ProjectEntity | null> {
        return this.projectService.findProject(id);
    }

    @Get()
    async findAllProjects(): Promise<ProjectEntity[]> {
        return this.projectService.findAllProjects();
    }

    @Put(':id')
    async updateProject(
        @Param('id') id: number,
        @Body() updated_project: ProjectEntityDto
    ): Promise<ProjectEntity> {
        return await this.projectService.updateProject(id, updated_project);
    }

    @Delete(':id')
    async deleteProject(@Param('id') id: number): Promise<string> {
        await this.projectService.deleteProject(id);
        return `Successfully project id ${id} deleted`;
    }

}
