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
    Query,
    ParseIntPipe
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

    @Get('/project/:id')
    async findAllWorkItemsByProjectId(@Param('id', ParseIntPipe) id: number): Promise<{ Work_item: WorkItem[] }> {
        return this.workItemsService.findAllByProjectId(id);
    }

    @Get()
    async getFilteredWorkItems(@Query() filterDto: WorkItemFilterDto): Promise<{ Work_item: WorkItemResponseDto[] }> {

        return this.workItemsService.getFilteredWorkItems(filterDto);
    }

    @UseInterceptors(WorkItemTransformInterceptor)
    @Get(':id')
    async getWorkItemById(@Param('id') id: number): Promise<{ Work_item: WorkItem }> {
        return this.workItemsService.findOne(id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createWorkItem(
        @Body()
        createWorkItemDto: CreateWorkItemDto
    ): Promise<{ Work_item: WorkItem, Message: string }> {

        let workItem =
            await this.workItemsService.
                CreateWorkItem(createWorkItemDto);

        return workItem;
    }

    @Put(':id')
    async updateWorkItem(
        @Param('id') id: number,
        @Body() updateWorkItemDto: UpdateWorkItemDto
    ): Promise<{ work_item: WorkItem, Message: string }> {
        return await this.workItemsService.UpdateWorkItem(id, updateWorkItemDto);
    }

    @Delete(':id')
    async deleteWorkItem(
        @Param('id') id: number
    ): Promise<{ Message: string }> {
        return await this.workItemsService.DeleteWorkItem(id);
    }
}

