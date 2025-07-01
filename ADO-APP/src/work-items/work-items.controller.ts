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
    UseInterceptors,
    Query
} from "@nestjs/common";

import { WorkItem } from "./work-items.entity";
import { WorkItemsService } from "./work-items.service";
import { CreateWorkItemDto } from "./dto/create-work-item-dto";
import { UpdateWorkItemDto } from "./dto/update-work-item-dto";
import { WorkItemTransformInterceptor } from "./interceptor/work-item.interceptor";
import { WorkItemFilterDto } from "./dto/work-item-filter.dto";
import { WorkItemResponseDto } from "./dto/work-item-response.dto";

@Controller('workitems')
export class WorkItemsController {
    constructor(
        private readonly workItemsService: WorkItemsService,
    ) { }

    @Get()
    async findAllWorkItems(): Promise<WorkItem[]> {
        return this.workItemsService.findAll();
    }

    @Get()
    async getFilteredWorkItems(@Query() filterDto: WorkItemFilterDto): Promise<WorkItemResponseDto[]> {
        return this.workItemsService.getFilteredWorkItems(filterDto);
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
    ): Promise<WorkItem> {
        return await this.workItemsService.UpdateWorkItem(id, updateWorkItemDto);
    }

    @Delete(':id')
    async deleteWorkItem(
        @Param('id') id: number
    ): Promise<string> {
        await this.workItemsService.DeleteWorkItem(id);
        return `Work item id ${id} has been deleted`;
    }
}

