import { Body, Controller, Post, Get, Delete, Put, Param, ParseIntPipe } from '@nestjs/common'
import { SprintDto } from './dto/sprints.dto';
import { SprintEntity } from './sprints.entity';
import { SprintService } from './sprints.service';
import { UpdateSprintDto } from './dto/update-sprint.dto';


@Controller('sprint')
export class SprintsController {
    constructor(private readonly service: SprintService) { }
    @Post(':id')
    async createSprint(@Param('id') projectId: number, @Body() dto: SprintDto): Promise<SprintEntity> {
        return await this.service.createSprint(projectId, dto);
    }

    @Get()
    async getAllSprint(): Promise<SprintEntity[]> {
        return await this.service.getAllSprint();
    }

    @Delete()
    async deleteSprint(sprintid: number) {
        return await this.service.delteSprint(sprintid);
    }

    @Get(':id')
    async getSprintById(sprint_id: number): Promise<SprintEntity | null> {
        return await this.service.getSprintById(sprint_id);
    }

    @Put(':id')
    async updateSprintName(@Param('id', ParseIntPipe) projectId: number,
        @Body() dto: UpdateSprintDto): Promise<SprintEntity> {
        return this.updateSprintName(projectId, dto);
    }
}
