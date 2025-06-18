import {
    Get,
    Post,
    Controller,
    Body,
    Put,
    Param,
    Delete,
    UsePipes,
    ValidationPipe,
    UseInterceptors
} from "@nestjs/common";

import { WorkItem } from "./work-items.entity";
import { WorkItemsService } from "./work-items.service";
import { CreateWorkItemDto } from "./dto/create-work-item-dto";
import { UpdateWorkItemDto } from "./dto/update-work-item-dto";
import { WorkItemTransformInterceptor } from "./interceptor/work-item.interceptor";

@Controller('workitems')
export class WorkItemsController {
    constructor(
        private readonly workItemsService: WorkItemsService,
    ) { }

    @Get()
    async findAllWorkItems(): Promise<WorkItem[]> {
        return this.workItemsService.findAll();
    }

    @UseInterceptors(WorkItemTransformInterceptor)
    @Get(':id')
    async getWorkItemById(@Param('id') id: number): Promise<WorkItem | null> {
        return this.workItemsService.findOne(id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createWorkItem(
        @Body()
        createWorkItemDto: CreateWorkItemDto
    ): Promise<WorkItem> {

        let workItem =
            await this.workItemsService.
                CreateWorkItem(createWorkItemDto);

        return workItem;
    }

    @Put(':id')
    async updateWorkItem(
        @Param('id') id: number,
        @Body() updateWorkItemDto: UpdateWorkItemDto
    ): Promise<string> {
        await this.workItemsService.UpdateWorkItem(id, updateWorkItemDto);
        return `Work item id ${id} had been updated`;
    }

    @Delete(':id')
    async deleteWorkItem(
        @Param('id') id: number
    ): Promise<string> {
        await this.workItemsService.DeleteWorkItem(id);
        return `Work item id ${id} has been deleted`;
    }
}

