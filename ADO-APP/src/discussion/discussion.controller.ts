import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Discussion } from "./discussion.entity";
import { CreateDiscussionDto } from "./dto/create-discussion.dto";
import { UpdateDiscussionDto } from "./dto/update-dicussion.dto";
import { DiscussionService } from "./discussion.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags('7. Discussion')
@Controller('discussion')
export class DiscussionController {
    constructor(private readonly discussionService: DiscussionService) { }

    @ApiBearerAuth('access-token')
    @Post()
    @ApiOperation({ summary: 'Create a new discussion comment' })
    @ApiResponse({ status: 201, description: 'Comment created', type: Discussion })
    async createDiscussion(
        @Body() createDiscussionDto: CreateDiscussionDto
    ): Promise<{ Discussion: Discussion; Message: string }> {
        return this.discussionService.createComment(createDiscussionDto);
    }

    @ApiBearerAuth('access-token')
    @Get('workitem/:id')
    @ApiOperation({ summary: 'Get all comments for a work item' })
    @ApiResponse({ status: 200, description: 'Comments retrieved', type: [Discussion] })
    async getCommentsByWorkItem(
        @Param('id') workitemid: number
    ): Promise<{ Discussion: Discussion[] }> {
        return this.discussionService.findWorkItemDiscussion(workitemid);
    }

    @ApiBearerAuth('access-token')
    @Put('workitem/:workitemid/comment/:commentid')
    @ApiOperation({ summary: 'Edit a comment' })
    @ApiResponse({ status: 200, description: 'Comment updated', type: Discussion })
    async editComment(
        @Param('workitemid') workitemid: number,
        @Param('commentid') commentid: number,
        @Body() updateDiscussion: UpdateDiscussionDto
    ): Promise<{ Discussion: Discussion; Message: string }> {
        return this.discussionService.updateComment(workitemid, commentid, updateDiscussion);
    }
}

