import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Discussion } from "./discussion.entity";
import { CreateDiscussionDto } from "./dto/create-discussion.dto";
import { DiscussionService } from "./discussion.service";
import { UpdateDiscussionDto } from "./dto/update-dicussion.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('7. Discussion')
@Controller('discussion')
export class DiscussionController {

    constructor(private readonly discussionService: DiscussionService) { }

    @Post()
    async createDiscussion(@Body() createDiscussionDto: CreateDiscussionDto): Promise<{ Discussion: Discussion, Message: string }> {
        return this.discussionService.createComment(createDiscussionDto);
    }

    @Get('workitem/:id')
    async getCommentsByWorkItem(@Param('id') workitemid: number): Promise<{ Discussion: Discussion[] }> {
        const comments = await this.discussionService.findWorkItemDiscussion(workitemid);
        return comments;
    }

    @Put('workitem/:workitemid/comment/:commentid')
    async editComment(
        @Param('workitemid') workitemid: number,
        @Param('commentid') commentid: number,
        @Body() updateDiscussion: UpdateDiscussionDto
    ): Promise<{ Discussion: Discussion, Message: string }> {
        return await this.discussionService.updateComment(workitemid, commentid, updateDiscussion);
    }

}
