// discussion.service.spec.ts
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscussionService } from '../discussion.service';
import { Discussion } from '../discussion.entity';
import { WorkItem } from 'src/work-items/work-items.entity';
import { User } from 'src/users/users.entity';
import { CreateDiscussionDto } from '../dto/create-discussion.dto';
import { UpdateDiscussionDto } from '../dto/update-dicussion.dto';
import { NotFoundException } from '@nestjs/common';
import { SprintEntity } from "src/tables/sprints/sprints.entity";
import { ProjectEntity } from "src/tables/project/project.entity";
import { ProjectMemberEntity } from "src/tables/project-member/project-member.entity";
import { Type } from 'src/work-items/enum/work-items-enum';
import { State } from 'src/work-items/enum/work-items-enum';
const mockUser: User = {
    id: 1,
    displayname: 'Alen',
    email: 'alen@gmail.com',
    password: 'password',
    created_projects: [],
    assigned_projects: [],
    project_memberships: [],
    created_workitems: [],
};

const mockProject: ProjectEntity = {
    project_id: 1,
    project_description: "First project",
    project_name: "Main project",
    sprints: [],
    work_items: [],
    project_creator: mockUser,
    members: []
}

const mockProjectMemberEntity: ProjectMemberEntity = {
    id: 1,
    user: mockUser,
    project: mockProject,
    role: "admin",
    assignedWorkItems: []
}

const mockSprint: SprintEntity = {
    id: 1,
    project: mockProject,
    project_id: 1,
    workitems: [],
    sprint_name: "First sprint",
    start_date: new Date(''),
    end_date: new Date(''),
    location: "ado",
}

const mockWorkitem: WorkItem = {
    id: 1,
    type: Type.Epic,
    title: "First Workitem",
    state: State.New,
    created_by: mockUser,
    description: "Sample workitem",
    assigned_to: 1,
    activity_date: new Date(''),
    area_path: "ado",
    iteration: "ado",
    assignedTo: mockProjectMemberEntity,
    sprint_id: 1,
    updated_at: new Date(''),
    created_at: new Date(''),
    completed_at: new Date(''),
    discussion: [],
    tags: [],
    childrens: [],
    sprint: mockSprint,
    project: mockProject,
    parent: null,
    classification: "business",
    planning: null
}

const mockCreateDiscussion: CreateDiscussionDto = {
    commentid: 1,
    workitemid: 1,
    creatorid: 1,
    message: 'This work is done',
    createdat: new Date(),
};

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

        const createdEntity = {
            message: mockCreateDiscussion.message,
            createdat: mockCreateDiscussion.createdat,
            workitem: mockWorkitem,
            creator: mockUser,
        };

        mockDiscussionRepo.create.mockReturnValue(createdEntity);
        mockDiscussionRepo.save.mockResolvedValue(createdEntity);

        const result = await service.createComment(mockCreateDiscussion);

        expect(mockDiscussionRepo.create).toHaveBeenCalledWith(createdEntity);
        expect(mockDiscussionRepo.save).toHaveBeenCalledWith(createdEntity);
        expect(result).toEqual(createdEntity);
    });

    it('should find a comment by id', async () => {
        mockDiscussionRepo.findOneBy.mockResolvedValue(mockCreateDiscussion);
        const result = await service.findOne(mockCreateDiscussion.commentid);

        expect(mockDiscussionRepo.findOneBy).toHaveBeenCalledWith({ commentid: mockCreateDiscussion.commentid });
        expect(result).toEqual(mockCreateDiscussion);
    });

    it('should find all discussions by workitem id', async () => {
        const discussions = [mockCreateDiscussion];
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
            const updated = { ...mockCreateDiscussion, ...mockUpdateDiscussionDto };

            mockDiscussionRepo.findOne.mockResolvedValue(mockCreateDiscussion);
            mockDiscussionRepo.save.mockResolvedValue(updated);

            const result = await service.updateComment(mockWorkitem.id, mockCreateDiscussion.commentid, mockUpdateDiscussionDto);

            expect(mockDiscussionRepo.findOne).toHaveBeenCalledWith({
                where: { commentid: mockCreateDiscussion.commentid, workitem: { id: mockWorkitem.id } },
            });
            expect(mockDiscussionRepo.save).toHaveBeenCalledWith(updated);
            expect(result).toEqual(updated);
        });

        it('should throw NotFoundException if comment does not exist', async () => {
            mockDiscussionRepo.findOne.mockResolvedValue(null);

            await expect(
                service.updateComment(mockWorkitem.id, mockCreateDiscussion.commentid, mockUpdateDiscussionDto)
            ).rejects.toThrowError(new NotFoundException(
                `Comment ${mockCreateDiscussion.commentid} not found in WorkItem ${mockWorkitem.id}`
            ));
        });
    });
});

