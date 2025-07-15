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
    ParseIntPipe,
    HttpStatus,
} from '@nestjs/common';
import { WorkItem } from './work-items.entity';
import { WorkItemsService } from './work-items.service';
import { CreateWorkItemDto } from './dto/create-work-item-dto';
import { UpdateWorkItemDto } from './dto/update-work-item-dto';
import { WorkItemTransformInterceptor } from './interceptor/work-item.interceptor';
import { WorkItemFilterDto } from './dto/work-item-filter.dto';
import { WorkItemResponseDto } from './dto/work-item-response.dto';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBearerAuth
} from '@nestjs/swagger';
import {
    CreateWorkItemSwaggerDto,
    FilteredWorkItemsSwaggerDto,
    WorkItemByIdSwaggerDto,
    AllWorkItemsSwaggerDto,
    UpdateWorkItemSwaggerDto,
    DeleteWorkItemSwaggerDto,
} from './dto/work-item-swagger.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@ApiTags('6. Work item')
@Controller('workitems')
export class WorkItemsController {
    constructor(private readonly workItemsService: WorkItemsService) { }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all work items by project ID' })
    @ApiOkResponse({ description: 'All work items fetched', type: AllWorkItemsSwaggerDto })
    @Get('/project/:id')
    async findAllWorkItemsByProjectId(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ Work_item: WorkItem[] }> {
        return this.workItemsService.findAllByProjectId(id);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Filter work items by multiple criteria' })
    @ApiOkResponse({ description: 'Filtered work items fetched', type: FilteredWorkItemsSwaggerDto })
    @Get()
    async getFilteredWorkItems(
        @Query() filterDto: WorkItemFilterDto,
    ): Promise<{ Work_item: WorkItemResponseDto[] }> {
        return this.workItemsService.getFilteredWorkItems(filterDto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get a work item by ID' })
    @ApiOkResponse({ description: 'Work item found', type: WorkItemByIdSwaggerDto })
    @UseInterceptors(WorkItemTransformInterceptor)
    @Get(':id')
    async getWorkItemById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ Work_item: WorkItem }> {
        return this.workItemsService.findOne(id);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new work item' })
    @ApiCreatedResponse({ description: 'Work item created', type: CreateWorkItemSwaggerDto })
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createWorkItem(
        @Body() createWorkItemDto: CreateWorkItemDto,
    ): Promise<{ Work_item: WorkItem; Message: string }> {
        return await this.workItemsService.createWorkItem(createWorkItemDto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update an existing work item' })
    @ApiOkResponse({ description: 'Work item updated', type: UpdateWorkItemSwaggerDto })
    @Put(':id')
    async updateWorkItem(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWorkItemDto: UpdateWorkItemDto,
    ): Promise<{ work_item: WorkItem; Message: string }> {
        return await this.workItemsService.UpdateWorkItem(id, updateWorkItemDto);
    }


    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete a work item' })
    @ApiOkResponse({ description: 'Work item deleted', type: DeleteWorkItemSwaggerDto })
    @Delete(':id')
    async deleteWorkItem(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ Message: string }> {
        return await this.workItemsService.DeleteWorkItem(id);
    }
}

