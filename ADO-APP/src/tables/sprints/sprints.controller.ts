import {
    Body,
    Controller,
    Post,
    Get,
    Delete,
    Put,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { SprintDto } from './dto/sprints.dto';
import { SprintService } from './sprints.service';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintEntity } from './sprints.entity';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBearerAuth
} from '@nestjs/swagger';
import {
    SprintCreatedSwaggerDto,
    AllSprintsSwaggerDto,
    SingleSprintSwaggerDto,
    DeleteSprintSwaggerDto,
    UpdateSprintSwaggerDto,
} from './dto/sprints-swagger.dto';

@ApiTags('5. Sprint')
@Controller('sprint')
export class SprintsController {
    constructor(private readonly service: SprintService) { }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new sprint for a project' })
    @ApiCreatedResponse({ description: 'Sprint created', type: SprintCreatedSwaggerDto })
    @Post(':id')
    async createSprint(
        @Param('id', ParseIntPipe) projectId: number,
        @Body() dto: SprintDto,
    ): Promise<{ Sprint: SprintEntity; Message: string }> {
        return await this.service.createSprint(projectId, dto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all sprints' })
    @ApiOkResponse({ description: 'All sprints fetched', type: AllSprintsSwaggerDto })
    @Get()
    async getAllSprint(): Promise<{ Sprint: SprintEntity[] }> {
        return await this.service.getAllSprint();
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete a sprint by ID' })
    @ApiOkResponse({ description: 'Sprint deleted', type: DeleteSprintSwaggerDto })
    @Delete(':id')
    async deleteSprint(
        @Param('id', ParseIntPipe) sprintId: number,
    ): Promise<{ Message: string }> {
        return await this.service.deleteSprint(sprintId);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get a sprint by its ID' })
    @ApiOkResponse({ description: 'Sprint found', type: SingleSprintSwaggerDto })
    @Get(':id')
    async getSprintById(
        @Param('id', ParseIntPipe) sprintId: number,
    ): Promise<{ Sprint: SprintEntity }> {
        return await this.service.getSprintById(sprintId);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get a sprint by project ID' })
    @ApiOkResponse({ description: 'Sprint by project ID found', type: SingleSprintSwaggerDto })
    @Get('/project/:id')
    async getSprintByProjectId(
        @Param('id', ParseIntPipe) projectId: number,
    ): Promise<{ Sprint: SprintEntity }> {
        return await this.service.getSprintByProjectId(projectId);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update a sprint' })
    @ApiOkResponse({ description: 'Sprint updated', type: UpdateSprintSwaggerDto })
    @Put(':id')
    async updateSprint(
        @Param('id', ParseIntPipe) sprintId: number,
        @Body() dto: UpdateSprintDto,
    ): Promise<{ Sprint: SprintEntity; Message: string }> {
        return await this.service.updateSprint(sprintId, dto);
    }
}

