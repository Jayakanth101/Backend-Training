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
    HttpCode,
    ParseIntPipe
} from "@nestjs/common";
import { TagService } from "./tag.service";
import { CreateTagDto } from "./dto/create-tag-dto";
import { Tags } from "./tag.entity";
import { UpdateTagDto } from "./dto/update-tag-dto";

@Controller('tag')
export class TagController {

    constructor(private readonly tagService: TagService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async createTag(@Body() tagDto: CreateTagDto): Promise<{ Tags: Tags, Message: string }> {
        return await this.tagService.createTag(tagDto);
    }

    @Get(':workitemId')
    async getAllTags(@Param('workitemId', ParseIntPipe) workItemId: number): Promise<{ Tags: Tags[] }> {
        return await this.tagService.getAllTags(workItemId);
    }

    @Put(':id')
    async updateTag(
        @Param('id', ParseIntPipe) tagId: number,
        @Body() mockTagdata: UpdateTagDto
    ): Promise<{ Tag: Tags, Message: string }> {
        return await this.tagService.updateTag(tagId, mockTagdata);
    }

    @Delete(':tagId/workitem/:workItemId')
    async removeTagFromWorkItem(
        @Param('tagId', ParseIntPipe) tagId: number,
        @Param('workItemId', ParseIntPipe) workItemId: number
    ): Promise<{ message: string }> {
        return await this.tagService.removeTagFromWorkItem(tagId, workItemId);
    }

}

