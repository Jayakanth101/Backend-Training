import { Repository } from "typeorm";
import { WorkItemsService } from "../work-items.service";
import { WorkItem } from "../work-items.entity";
import { State, Type } from "../enum/work-items-enum";
import { Planning } from "src/planning/planning.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import {
    mockWorkitem,
    mockProjectMemberEntity,
    mockPlanning,
    mockWorkItemDto,
    mockPlanningDto,
    mockUpdateWorkItemDto,
    mockWorkitems
} from "src/mock-datas";

describe('WorkItem', () => {
    let service: WorkItemsService;
    let repo: Repository<WorkItem>;

    mockWorkItemDto.planning = mockPlanningDto;
    mockWorkitem.planning = mockPlanning;
    mockProjectMemberEntity.assignedWorkItems.push(mockWorkitem);

    mockUpdateWorkItemDto.planning = mockPlanningDto;

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

            const result = await service.CreateWorkItem(mockWorkItemDto);

            expect(mockWorkItemRepo.create).toHaveBeenCalledWith(mockWorkItemDto);
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

            let mockCreated = { ...mockWorkitem, ...mockUpdateWorkItemDto };
            mockWorkItemRepo.findOne.mockResolvedValue(mockWorkitem);

            mockWorkItemRepo.create.mockResolvedValue(mockCreated);

            mockCreated = { ...mockWorkitem, ...mockUpdateWorkItemDto, planning: mockPlanning };

            mockWorkItemRepo.save.mockResolvedValue(mockCreated);

            const result = await service.UpdateWorkItem(mockWorkitem.id, mockUpdateWorkItemDto);

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
    });

});

