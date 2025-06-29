// discussion.service.spec.ts
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiscussionService } from '../discussion.service';
import { Discussion } from '../discussion.entity';
import { WorkItem } from '../../work-items/work-items.entity';
import { User } from '../../users/users.entity';
import { UpdateDiscussionDto } from '../dto/update-dicussion.dto';
import { NotFoundException } from '@nestjs/common';
import { mockUser, mockCreateDiscussionDto, mockWorkitem, mockDiscussion } from '../../mock-datas';


const mockUpdateDiscussionDto: UpdateDiscussionDto = {
    message: 'This work is done by jhon',
    createdat: new Date(),
};

describe('DiscussionService', () => {
    let service: DiscussionService;
    let mockDiscussionRepo: Record<string, jest.Mock>;
    let mockWorkitemRepo: Record<string, jest.Mock>;
    let mockUserRepo: Record<string, jest.Mock>;


    beforeEach(async () => {
        mockDiscussionRepo = {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
        };

        mockWorkitemRepo = {
            findOneBy: jest.fn(),
        };

        mockUserRepo = {
            findOneBy: jest.fn(),
        };

        const moduleRef = await Test.createTestingModule({
            providers: [
                DiscussionService,
                { provide: getRepositoryToken(Discussion), useValue: mockDiscussionRepo },
                { provide: getRepositoryToken(WorkItem), useValue: mockWorkitemRepo },
                { provide: getRepositoryToken(User), useValue: mockUserRepo },
            ],
        }).compile();

        service = moduleRef.get<DiscussionService>(DiscussionService);
    });

    it('should create a comment in the discussion table', async () => {
        mockWorkitemRepo.findOneBy.mockResolvedValue(mockWorkitem);
        mockUserRepo.findOneBy.mockResolvedValue(mockUser);

        const createdEntity = mockDiscussion;
        mockDiscussionRepo.create.mockReturnValue(createdEntity);
        mockDiscussionRepo.save.mockResolvedValue(createdEntity);

        const result = await service.createComment(mockCreateDiscussionDto);

        expect(mockDiscussionRepo.create).toHaveBeenCalledWith(mockCreateDiscussionDto);
        expect(mockDiscussionRepo.save).toHaveBeenCalledWith(createdEntity);
        expect(result).toEqual(createdEntity);
    });

    it('should find a comment by id', async () => {
        mockDiscussionRepo.findOneBy.mockResolvedValue(mockCreateDiscussionDto);
        const result = await service.findOne(mockCreateDiscussionDto.commentid);

        expect(mockDiscussionRepo.findOneBy).toHaveBeenCalledWith({ commentid: mockCreateDiscussionDto.commentid });
        expect(result).toEqual(mockCreateDiscussionDto);
    });

    it('should find all discussions by workitem id', async () => {
        const discussions = [mockCreateDiscussionDto];
        mockDiscussionRepo.find.mockResolvedValue(discussions);

        const result = await service.findWorkItemDiscussion(mockWorkitem.id);

        expect(mockDiscussionRepo.find).toHaveBeenCalledWith({
            where: { workitem: { id: mockWorkitem.id } },
            relations: ['creator'],
            order: { createdat: 'ASC' },
        });
        expect(result).toEqual(discussions);
    });

    describe('updateComment()', () => {
        it('should update the comment if found', async () => {
            const updated = { ...mockCreateDiscussionDto, ...mockUpdateDiscussionDto };

            mockDiscussionRepo.findOne.mockResolvedValue(mockCreateDiscussionDto);
            mockDiscussionRepo.save.mockResolvedValue(updated);

            const result = await service.updateComment(mockWorkitem.id, mockCreateDiscussionDto.commentid, mockUpdateDiscussionDto);

            expect(mockDiscussionRepo.findOne).toHaveBeenCalledWith({
                where: { commentid: mockCreateDiscussionDto.commentid, workitem: { id: mockWorkitem.id } },
            });
            expect(mockDiscussionRepo.save).toHaveBeenCalledWith(updated);
            expect(result).toEqual(updated);
        });

        it('should throw NotFoundException if comment does not exist', async () => {
            mockDiscussionRepo.findOne.mockResolvedValue(null);

            await expect(
                service.updateComment(mockWorkitem.id, mockCreateDiscussionDto.commentid, mockUpdateDiscussionDto)
            ).rejects.toThrowError(new NotFoundException(
                `Comment ${mockCreateDiscussionDto.commentid} not found in WorkItem ${mockWorkitem.id}`
            ));
        });
    });
});

