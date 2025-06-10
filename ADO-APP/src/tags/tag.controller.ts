import { Body, HttpStatus, Controller, Post, UsePipes, ValidationPipe, HttpException, Delete, Param, Put } from "@nestjs/common";
import { TagService } from "./tag.service";
import { CreateTagDto } from "./dto/create-tag-dto";
import { Tags } from "./tag.entity";

@Controller('tag')
export class TagController {

    constructor(private readonly tagService: TagService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async CreateTag(@Body() tagDto: CreateTagDto): Promise<Tags> {
        try {
            return await this.tagService.CreateTag(tagDto);
        }
        catch (error) {
            if (error.code === '23505' || error.message.includes('duplicate key')) {
                throw new HttpException(
                    'Tag name already exists',
                    HttpStatus.CONFLICT
                );
            }
            throw new HttpException(
                'Failed to create tag',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<string> {
        return await this.tagService.deleteTag(id);
    }

}
