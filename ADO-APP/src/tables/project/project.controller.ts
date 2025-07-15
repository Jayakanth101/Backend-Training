import {
    Body,
    Controller,
    Post,
    Get,
    Param,
    Delete,
    Put,
    UsePipes,
    ValidationPipe,
    UseGuards,
    HttpStatus,
} from '@nestjs/common';
import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectEntityDto } from './dto/project.dto';
import { Roles } from 'src/custom-decorators/roles.decorator';
import { ProjectRolesGuard } from 'src/guards/project-role.guards';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import {
    CreateProjectResponseDto,
    FindAllProjectsResponseDto,
    FindProjectResponseDto,
    UpdateProjectResponseDto,
    DeleteProjectResponseDto,
} from './dto/project-response.dto';

@ApiTags('3. Project')
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new project' })
    @ApiCreatedResponse({ description: 'Project created', type: CreateProjectResponseDto })
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createProject(@Body() dto: ProjectEntityDto): Promise<{ project: ProjectEntity }> {
        return this.projectService.createProject(dto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Find project by ID' })
    @ApiOkResponse({ description: 'Project found', type: FindProjectResponseDto })
    @Get(':id')
    async findProject(@Param('id') id: number): Promise<{ project: ProjectEntity }> {
        return this.projectService.findProject(id);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all projects' })
    @ApiOkResponse({ description: 'All projects', type: FindAllProjectsResponseDto })
    @Get()
    async findAllProjects(): Promise<{ projects: ProjectEntity[] }> {
        return this.projectService.findAllProjects();
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update a project by ID' })
    @ApiOkResponse({ description: 'Project updated', type: UpdateProjectResponseDto })
    @UseGuards(ProjectRolesGuard)
    @Roles('admin', 'developers', 'tester')
    @Put(':id')
    async updateProject(
        @Param('id') id: number,
        @Body() updated_project: ProjectEntityDto,
    ): Promise<{ project: ProjectEntity; message: string }> {
        return await this.projectService.updateProject(id, updated_project);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete a project by ID' })
    @ApiOkResponse({ description: 'Project deleted', type: DeleteProjectResponseDto })
    @UseGuards(ProjectRolesGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteProject(@Param('id') id: number): Promise<{ message: string }> {
        return await this.projectService.deleteProject(id);
    }
}

