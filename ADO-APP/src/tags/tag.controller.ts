import {
    Body,
    Controller,
    Post,
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
import { WorkItem } from "../../src/work-items/work-items.entity";

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

    @Delete(':id')
    @HttpCode(200)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<{ Message: string }> {
        return await this.tagService.deleteTag(id);
    }

}

