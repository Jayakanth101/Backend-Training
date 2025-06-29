import { Test } from "@nestjs/testing"
import { TagController } from "../tag.controller"
import { TagService } from "../tag.service"
import { mockTag, mockTagDto, mockWorkitem } from "../../mock-datas"

describe('TagController', () => {

    const mockTagService = {
        createTag: jest.fn(),
        getAllTags: jest.fn(),
        deleteTag: jest.fn()
    }
    let controller: TagController;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [TagController],
            providers: [
                {
                    provide: TagService, useValue: mockTagService
                }
            ]
        }).compile();
        controller = module.get<TagController>(TagController);
    });

    describe('create tag', () => {
        it('it creates a tag', async () => {
            mockTagService.createTag.mockReturnValue(mockTag);

            const result = await controller.createTag(mockTagDto);

            expect(mockTagService.createTag).toHaveBeenCalledWith(mockTagDto);

            expect(result).toEqual(mockTag);
        });
    });

    describe('get workitems', () => {
        it('it get all workitems', async () => {
            mockTagService.getAllTags.mockResolvedValue([mockTag]);

            const result = await controller.getAllWorkitems(mockWorkitem.id);

            expect(mockTagService.getAllTags).toHaveBeenCalledWith(mockWorkitem.id);

            expect(result).toEqual([mockTag]);
        });
    });

    describe('deleteTag', () => {
        const mockReturnValue = `Tag ${mockTag.id} is deleted`;
        it('it delete a tag', async () => {
            mockTagService.deleteTag.mockResolvedValue(mockReturnValue);

            const result = await controller.delete(mockTag.id);

            expect(mockTagService.deleteTag).toHaveBeenCalledWith(mockTag.id);
            expect(result).toEqual(mockReturnValue);
        });
    });
})
