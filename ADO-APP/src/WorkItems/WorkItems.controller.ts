import { Get, Post, Controller, Body, Put, Patch, Param, Delete } from "@nestjs/common";
import { WorkItems } from "./WorkItems.entity";
import { WorkItemsService } from "./WorkItems.service";
import { async, retry } from "rxjs";

@Controller('workitems')
export class WorkItemsController {
    constructor(private readonly workItemsService: WorkItemsService) { }

    @Get()
    async findAll(): Promise<WorkItems[]> {
        return this.workItemsService.findAll();
    }

    @Post()
    async Create(@Body() workItems: WorkItems): Promise<string> {
        await this.workItemsService.CreateEpic(workItems);
        return "Epic has been created";
    }

    @Put(':id')
    async Update(@Param('id') id: number, @Body() updatedDto: Partial<WorkItems>) {
        return this.workItemsService.UpdateEpic(id, updatedDto);
    }

    @Delete(':id')
    async Delete(@Param('id') id: number): Promise<string> {
        await this.workItemsService.DeleteEpic(id);
        return `Work item ${id} has been deleted`;
    }
}

