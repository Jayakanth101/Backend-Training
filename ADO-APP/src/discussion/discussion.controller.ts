import { Body, Controller, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { Discussion } from "./discussion.entity";
import { CreateDiscussionDto } from "./dto/create-discussion.dto";
import { DiscussionService } from "./discussion.service";
import { User } from "src/users/users.entity";

@Controller('discussion')
export class DiscussionController {

    constructor(private readonly discussionService: DiscussionService) { }

    @Post()
    async createDiscussion(@Body() createDiscussionDto: CreateDiscussionDto): Promise<Discussion> {
        console.log("From discussion controller: ", createDiscussionDto.workitemid, createDiscussionDto.creatorid);
        return this.discussionService.createComment(createDiscussionDto);
    }


    @Get('workitem/:id')
    async getCommentsByWorkItem(@Param('id') workitemid: number): Promise<Discussion[]> {
        console.log("work item id from discussion controller: ", workitemid);
        const comments: Discussion[] = await this.discussionService.findWorkItemDiscussion(workitemid);
        if (comments.length == 0) {
            throw new NotFoundException(`No comments found in this workitem ${workitemid}`);
        }
        return comments;
    }

    @Put('workitem/:workitemid/comment/:commentid')
    async editComment(
        @Param('workitemid') workitemid: number,
        @Param('commentid') commentid: number,
        @Body() createDiscussionDto: CreateDiscussionDto
    ): Promise<Discussion> {
        return this.discussionService.updateComment(workitemid, commentid, createDiscussionDto);

    }

}
