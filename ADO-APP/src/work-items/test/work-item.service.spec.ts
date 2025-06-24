import { Repository } from "typeorm";
import { WorkItemsService } from "../work-items.service";
import { WorkItem } from "../work-items.entity";
import { CreateWorkItemDto } from "../dto/create-work-item-dto";
import { Risk, State, Type } from "../enum/work-items-enum";
import { User } from "src/users/users.entity";
import { ProjectMemberEntity } from "src/tables/project-member/project-member.entity";
import { ProjectEntity } from "src/tables/project/project.entity";
import { Planning } from "src/planning/planning.entity";
import { SprintEntity } from "src/tables/sprints/sprints.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreatePlanningDto } from "src/planning/dto/planning.dto";
import { UpdateWorkItemDto } from "../dto/update-work-item-dto";
import { mock } from "node:test";


describe('WorkItem', () => {
    let service: WorkItemsService;
    let repo: Repository<WorkItem>;

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

    const mockWorkitems: WorkItem[] = [{
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
    }]
    const mockPlanning: Planning = {
        planning_id: 1,
        work_item: mockWorkitem,
        priority: 1,
        story_point: 1,
        risk: Risk.Low,
        effort: 1,
        business_value: 1,
        time_criticality: 1,
        start_date: new Date(''),
        target_date: new Date(''),
    }

    const workItemDto: CreateWorkItemDto = {
        type: Type.Epic,
        title: "First Workitem",
        state: State.New,
        createdby: 1,
        description: "Sample workitem",
        activity_date: new Date(''),
        area_path: "ado",
        iteration: "ado",
        assigned_to: 1,
        parentid: null,
        classification: "business",
        planning: null,
    }
    const planningDto: CreatePlanningDto = {
        priority: 1,
        storypoint: 1,
        risk: Risk.Low,
        effort: 1,
        businessvalue: 1,
        timecriticality: 1,
        startdate: new Date(''),
        targetdate: new Date(''),

    }
    workItemDto.planning = planningDto;

    mockWorkitem.planning = mockPlanning;
    mockProjectMemberEntity.assignedWorkItems.push(mockWorkitem);

    const UpdateWorkItemDto: UpdateWorkItemDto = {
        type: Type.Epic,
        title: "First Workitem and it is updated",
        state: State.New,
        createdby: 1,
        description: "Sample workitem and it is updted description",
        activity_date: new Date(''),
        area_path: "ado",
        iteration: "ado",
        assigned_to: 1,
        parentid: null,
        classification: "business",
        planning: null,
    }
    UpdateWorkItemDto.planning = planningDto;

    const mockWorkItemRepo = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(() => ({
            andWhere: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn()
        })),
    };
    const mockPlanningRepo = {
        create: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkItemsService,
                {
                    provide: getRepositoryToken(WorkItem),
                    useValue: mockWorkItemRepo
                },
                {
                    provide: getRepositoryToken(Planning),
                    useValue: mockPlanningRepo
                }
            ]
        }).compile();

        service = module.get<WorkItemsService>(WorkItemsService);
    });

    describe('CreateWorkItem()', () => {
        it('it creates work item', async () => {
            mockWorkItemRepo.create.mockReturnValue(mockWorkitem);
            mockWorkItemRepo.save.mockReturnValue(mockWorkitem);

            const result = await service.CreateWorkItem(workItemDto);

            expect(mockWorkItemRepo.create).toHaveBeenCalledWith(workItemDto);
            expect(mockWorkItemRepo.save).toHaveBeenCalledWith(mockWorkitem);

            expect(result).toEqual(mockWorkitem);

        })
    });

    describe('findAll()', () => {
        it('it finds all the workitem', async () => {
            mockWorkItemRepo.find.mockResolvedValue(mockWorkitems);

            const result = await service.findAll();

            expect(mockWorkItemRepo.find).toHaveBeenCalled();

            expect(result).toEqual(mockWorkitems);
        });
    });

    describe('updateWorkItem()', () => {
        it('it update the workitem by id', async () => {

            let mockCreated = { ...mockWorkitem, ...UpdateWorkItemDto };
            mockWorkItemRepo.findOne.mockResolvedValue(mockWorkitem);

            mockWorkItemRepo.create.mockResolvedValue(mockCreated);

            mockCreated = { ...mockWorkitem, ...UpdateWorkItemDto, planning: mockPlanning };

            mockWorkItemRepo.save.mockResolvedValue(mockCreated);

            const result = await service.UpdateWorkItem(mockWorkitem.id, UpdateWorkItemDto);

            expect(mockWorkItemRepo.findOne).toHaveBeenCalledWith({
                where: { id: mockWorkitem.id }, relations: ['planning']
            });
            expect(mockWorkItemRepo.save).toHaveBeenCalledWith(expect.any(Object));

            expect(result).toEqual(mockCreated);
        });
    });

    describe('findOne()', () => {
        it('it find the one workitem by id', async () => {
            mockWorkItemRepo.findOne.mockResolvedValue(mockWorkitem);

            const result = await service.findOne(mockWorkitem.id);

            expect(mockWorkItemRepo.findOne).toHaveBeenCalledWith({ where: { id: mockWorkitem.id }, relations: ['planning'] });
            expect(result).toEqual(mockWorkitem);
        });
    });
    describe('getFilteredWorkItems()', () => {
        it('should call query builder with filters and return filtered work items', async () => {
            const mockFilterDto = {
                id: 1,
                type: Type.Epic,
                assigned_to: 1,
                state: State.New,
                area_path: 'ado',
                // tags: [{ tagname: 'frontend' }],
                recently_created: true,
                recently_updated: false,
                recently_completed: false,
                keyword: 'Workitem'
            }

            const mockQueryBuilder = {
                andWhere: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(mockWorkitems)
            };

            mockWorkItemRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.getFilteredWorkItems(mockFilterDto);

            expect(mockWorkItemRepo.createQueryBuilder).toHaveBeenCalledWith('workitem');
            expect(mockQueryBuilder.andWhere).toHaveBeenCalled(); // General check
            expect(mockQueryBuilder.getMany).toHaveBeenCalled();
            expect(result).toEqual(mockWorkitems);
        });
    });

    describe('delete()', () => {
        it('it deletes the workitem by id', async () => {
            mockWorkItemRepo.findOneBy.mockResolvedValue(mockWorkitem.id);
            const result = await service.DeleteWorkItem(mockWorkitem.id);

            expect(mockWorkItemRepo.findOneBy).toHaveBeenCalledWith({ id: mockWorkitem.id });

            const resultString = `Successfully deleted ${mockWorkitem.id}`;
            expect(result).toEqual(resultString);
        })
    })

});

