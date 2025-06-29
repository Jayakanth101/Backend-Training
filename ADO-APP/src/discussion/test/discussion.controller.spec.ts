import { Test } from "@nestjs/testing";
import { DiscussionService } from "../discussion.service"
import { DiscussionController } from "../discussion.controller";
import { mockCreateDiscussionDto, mockDiscussion, mockWorkitem } from "../../mock-datas";

describe('DiscussonController', () => {
    let controller: DiscussionController;


    const mockDiscussionService = {
        createComment: jest.fn(),
        findWorkItemDiscussion: jest.fn(),
        updateComment: jest.fn()
    };
    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [DiscussionController],
            providers: [
                { provide: DiscussionService, useValue: mockDiscussionService }
            ]
        }).compile();
        controller = module.get<DiscussionController>(DiscussionController);

    });

    describe('CreateDiscussion()', () => {
        it('create discusson', async () => {
            mockDiscussionService.createComment.mockReturnValue(mockDiscussion);

            const result = await controller.createDiscussion(mockCreateDiscussionDto);

            expect(mockDiscussionService.createComment).toHaveBeenCalledWith(mockCreateDiscussionDto);

            expect(result).toEqual(mockDiscussion);
        })

        it('it get a comments by workitem id', async () => {
            mockDiscussionService.findWorkItemDiscussion.mockResolvedValue([mockDiscussion]);
            const result = await controller.getCommentsByWorkItem(mockWorkitem.id);

            expect(mockDiscussionService.findWorkItemDiscussion).toHaveBeenCalledWith(mockWorkitem.id);

            expect(result).toEqual([mockDiscussion]);
        })

        it('it edit comment by workitem id', async () => {
            mockDiscussionService.updateComment.mockResolvedValue(mockDiscussion);

            const result = await controller.editComment(mockWorkitem.id, mockDiscussion.commentid, mockCreateDiscussionDto);

            expect(mockDiscussionService.updateComment).toHaveBeenCalledWith(mockWorkitem.id, mockDiscussion.commentid, mockCreateDiscussionDto);
            expect(result).toEqual(mockDiscussion);
        });
    });

})
