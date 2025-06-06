import { Get, Post, Controller, Body, Put, Param, Delete, UsePipes, ValidationPipe, NotFoundException } from "@nestjs/common";
import { WorkItem } from "./work-items.entity";
import { WorkItemsService } from "./work-items.service";
import { CreateWorkItemDto } from "./dto/create-work-item-dto";
import { UpdateWorkItemDto } from "./dto/update-work-item-dto";

@Controller('workitems')
export class WorkItemsController {
    constructor(
        private readonly workItemsService: WorkItemsService,
    ) { }

    @Get()
    async findAll(): Promise<WorkItem[]> {
        return this.workItemsService.findAll();
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))

    async Create(@Body() createWorkItemDto: CreateWorkItemDto): Promise<WorkItem> {
        return await this.workItemsService.CreateWorkItem(createWorkItemDto);
    }


    @Put(':id')
    async Update(@Param('id') id: number, @Body() updateWorkItemDto: UpdateWorkItemDto): Promise<string> {
        await this.workItemsService.UpdateWorkItem(id, updateWorkItemDto);
        return `Work item id ${id} had been updated`;
    }

    @Delete(':id')
    async Delete(@Param('id') id: number): Promise<string> {
        await this.workItemsService.DeleteWorkItem(id);
        return `Work item id ${id} has been deleted`;
    }
}

