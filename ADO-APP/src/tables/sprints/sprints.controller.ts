import {
    Body,
    Controller,
    Post,
    Get,
    Delete,
    Put,
    Param,
    ParseIntPipe
} from '@nestjs/common';
import { SprintDto } from './dto/sprints.dto';
import { SprintService } from './sprints.service';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintEntity } from './sprints.entity';

@Controller('sprint')
export class SprintsController {
    constructor(private readonly service: SprintService) { }

    @Post(':id')
    async createSprint(
        @Param('id', ParseIntPipe) projectId: number,
        @Body() dto: SprintDto
    ): Promise<{ Sprint: SprintEntity; Message: string }> {
        return await this.service.createSprint(projectId, dto);
    }

    @Get()
    async getAllSprint(): Promise<{ Sprint: SprintEntity[] }> {
        return await this.service.getAllSprint();
    }

    @Delete(':id')
    async deleteSprint(
        @Param('id', ParseIntPipe) sprintId: number
    ): Promise<{ Message: string }> {
        return await this.service.deleteSprint(sprintId);
    }

    @Get(':id')
    async getSprintById(
        @Param('id', ParseIntPipe) sprintId: number
    ): Promise<{ Sprint: SprintEntity }> {
        return await this.service.getSprintById(sprintId);
    }

    @Get('/project/:id')
    async getSprintByProjectId(
        @Param('id', ParseIntPipe) projectId: number
    ): Promise<{ Sprint: SprintEntity }> {
        return await this.service.getSprintByProjectId(projectId);
    }

    @Put(':id')
    async updateSprint(
        @Param('id', ParseIntPipe) sprintId: number,
        @Body() dto: UpdateSprintDto
    ): Promise<{ Sprint: SprintEntity; Message: string }> {
        return await this.service.updateSprint(sprintId, dto);
    }
}

