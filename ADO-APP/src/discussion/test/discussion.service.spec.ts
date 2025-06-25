import { WorkItem } from "src/work-items/work-items.entity"
import { State, Type } from "src/work-items/enum/work-items-enum"
import { User } from "src/users/users.entity"
import { ProjectEntity } from "src/tables/project/project.entity"
import { ProjectMemberEntity } from "src/tables/project-member/project-member.entity"
import { SprintEntity } from "src/tables/sprints/sprints.entity"
import { Test } from "@nestjs/testing"
import { DiscussionService } from "../discussion.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Discussion } from "../discussion.entity"
import { Repository } from "typeorm"
import { CreateDiscussionDto } from "../dto/create-discussion.dto"
import { UpdateDiscussionDto } from "../dto/update-dicussion.dto"
describe('createComment()', () => {

    const mockUser: User = {
        id: 1,
        displayname: "Alen",
        email: "alen@gmail.com",
        password: "password",
        created_projects: [],
        assigned_projects: [],
        project_memberships: [],
        created_workitems: []
    }

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
        message: "This work is done",
        createdat: new Date(''),
    }

    const mockUpdateDiscussionDto: UpdateDiscussionDto = {
        message: "This work is done by jhon",
        createdat: new Date(''),
    }


    let service: DiscussionService;
    let discussionRepo: Repository<Discussion>;

    const mockDiscussionRepo = {
        create: jest.fn().mockReturnValue(mockCreateDiscussion),
        save: jest.fn(),
        findOneBy: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn()
    }
    const mockWorkitemRepo = {
        findOneBy: jest.fn(),
        findOne: jest.fn(),
    }

    const mockUserRepo = {
        findOneBy: jest.fn(),
    }

    const mockCreateDiscussions = [{
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
    }];

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                DiscussionService,
                {
                    provide: getRepositoryToken(Discussion),
                    useValue: mockDiscussionRepo,
                },
                {
                    provide: getRepositoryToken(WorkItem),
                    useValue: mockWorkitemRepo,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo,
                }
            ],
        }).compile();
        service = module.get<DiscussionService>(DiscussionService);
        discussionRepo = module.get<Repository<Discussion>>(getRepositoryToken(Discussion));
    });

    it('it creates a comment in the discussion table', async () => {
        mockWorkitemRepo.findOneBy.mockReturnValue(mockWorkitem);
        mockUserRepo.findOneBy.mockResolvedValue(mockUser);
        mockDiscussionRepo.create.mockResolvedValue(mockCreateDiscussion);
        mockDiscussionRepo.save.mockResolvedValue(mockCreateDiscussion);

        const result = await service.createComment(mockCreateDiscussion);

        expect(mockWorkitemRepo.findOneBy).toHaveBeenCalledWith({ id: mockCreateDiscussion.workitemid });
        expect(mockUserRepo.findOneBy).toHaveBeenCalledWith({ id: mockCreateDiscussion.creatorid });

        expect(discussionRepo.create).toHaveBeenCalledWith({
            message: mockCreateDiscussion.message,
            createdat: mockCreateDiscussion.createdat || new Date(),
            workitem: mockWorkitem,
            creator: mockUser
        });

        expect(discussionRepo.save).toHaveBeenCalledWith(mockCreateDiscussion);
        expect(result).toEqual(mockCreateDiscussion);

    });

    it('it updates a comment in the discussion table', async () => {
        mockDiscussionRepo.findOne.mockResolvedValue(mockCreateDiscussion);
        const updatedComment = mockCreateDiscussion;
        updatedComment.message = mockUpdateDiscussionDto.message;
        updatedComment.createdat = mockUpdateDiscussionDto.createdat;

        const result = service.updateComment(mockWorkitem.id, mockCreateDiscussion.commentid, mockUpdateDiscussionDto);

        mockDiscussionRepo.save.mockResolvedValue(mockCreateDiscussion);

        expect(mockDiscussionRepo.save).toHaveBeenCalledWith(updatedComment);

        expect(result).toEqual(UpdateDiscussionDto);
    });

    it('it will find a comment by an id', async () => {
        mockDiscussionRepo.findOneBy.mockResolvedValue(mockCreateDiscussion);
        const result = service.findOne(mockCreateDiscussion.commentid);

        expect(mockDiscussionRepo.findOneBy).
            toHaveBeenCalledWith({ commentid: mockCreateDiscussion.commentid });
        expect(result).toEqual(mockCreateDiscussion);
    });

    it('it will find all the discussions in a workitem', async () => {
        mockDiscussionRepo.find.mockResolvedValue(mockCreateDiscussion);
        const result = await service.findWorkItemDiscussion(mockWorkitem.id);

        expect(mockDiscussionRepo.find).toHaveBeenCalledWith({
            where: { workitem: { id: mockWorkitem.id } },
            relations: ['creator'],
            order: { createdat: 'ASC' }
        });
        expect(result).toEqual(mockCreateDiscussions);
    });
});
