import {
    Body,
    Controller,
    Post,
    Put,
    UsePipes,
    ValidationPipe,
    Delete,
    Param,
    Get,
    ParseIntPipe,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag-dto';
import { Tags } from './tag.entity';
import { UpdateTagDto } from './dto/update-tag-dto';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBearerAuth
} from '@nestjs/swagger';
import {
    CreateTagSwaggerDto,
    GetAllTagsSwaggerDto,
    UpdateTagSwaggerDto,
    RemoveTagSwaggerDto,
} from './dto/tag-swagger.dto';

@ApiTags('8. Tags')
@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) { }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new tag' })
    @ApiCreatedResponse({ description: 'Tag created', type: CreateTagSwaggerDto })
    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async createTag(
        @Body() tagDto: CreateTagDto,
    ): Promise<{ Tags: Tags; Message: string }> {
        return await this.tagService.createTag(tagDto);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all tags for a work item' })
    @ApiOkResponse({ description: 'Tags fetched', type: GetAllTagsSwaggerDto })
    @Get(':workitemId')
    async getAllTags(
        @Param('workitemId', ParseIntPipe) workItemId: number,
    ): Promise<{ Tags: Tags[] }> {
        return await this.tagService.getAllTags(workItemId);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update a tag' })
    @ApiOkResponse({ description: 'Tag updated', type: UpdateTagSwaggerDto })
    @Put(':id')
    async updateTag(
        @Param('id', ParseIntPipe) tagId: number,
        @Body() mockTagdata: UpdateTagDto,
    ): Promise<{ Tag: Tags; Message: string }> {
        return await this.tagService.updateTag(tagId, mockTagdata);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Remove a tag from a work item' })
    @ApiOkResponse({ description: 'Tag removed from work item', type: RemoveTagSwaggerDto })
    @Delete(':tagId/workitem/:workItemId')
    async removeTagFromWorkItem(
        @Param('tagId', ParseIntPipe) tagId: number,
        @Param('workItemId', ParseIntPipe) workItemId: number,
    ): Promise<{ message: string }> {
        return await this.tagService.removeTagFromWorkItem(tagId, workItemId);
    }
}

