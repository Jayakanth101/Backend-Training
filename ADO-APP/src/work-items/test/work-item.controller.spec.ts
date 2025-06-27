import { Test } from "@nestjs/testing";
import { WorkItem } from "../work-items.entity";
import { WorkItemsController } from "../work-items.controller";
import { WorkItemsService } from "../work-items.service";
import { mockUpdateWorkItemDto, mockWorkitem, mockWorkItemDto, mockWorkitemFilterDto, mockWorkitems } from "src/mock-datas";
import { State } from "../enum/work-items-enum";
import { UpdateWorkItemDto } from "../dto/update-work-item-dto";

describe('', () => {
    const mockWorkitemService = {
        findAll: jest.fn(),
        getFilteredWorkItems: jest.fn(),
        findOne: jest.fn(),
        CreateWorkItem: jest.fn(),
        UpdateWorkItem: jest.fn(),
        DeleteWorkItem: jest.fn(),
    }
    let controller: WorkItemsController;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [WorkItemsController],
            providers: [
                {
                    provide: WorkItemsService,
                    useValue: mockWorkitemService,
                }
            ]
        }).compile();
        controller = module.get<WorkItemsController>(WorkItemsController);
    });


    describe('findWorkitem()', () => {
        it('it finds all workitems', async () => {
            mockWorkitemService.findAll.mockResolvedValue(mockWorkitems);

            const result = await controller.findAllWorkItems();

            expect(mockWorkitemService.findAll).toHaveBeenCalledWith();
            expect(result).toEqual(mockWorkitems);
        });

        it('it filter workitems by mock filter dto', async () => {
            mockWorkitemService.getFilteredWorkItems.mockResolvedValue(mockWorkitems);

            const result = await controller.getFilteredWorkItems(mockWorkitemFilterDto);

            expect(mockWorkitemService.getFilteredWorkItems).toHaveBeenCalledWith(mockWorkitemFilterDto);
            expect(result).toEqual(mockWorkitems);
        });

        it('get workitem by id', async () => {
            mockWorkitemService.findOne.mockResolvedValue(mockWorkitem);

            const result = await controller.getWorkItemById(mockWorkitem.id);

            expect(mockWorkitemService.findOne).toHaveBeenCalledWith(mockWorkitem.id);
            expect(result).toEqual(mockWorkitem);
        });
    });

    describe('createWorkItem()', () => {
        it('it create work item', async () => {
            mockWorkitemService.CreateWorkItem.mockReturnValue(mockWorkitem);

            const result = await controller.createWorkItem(mockWorkItemDto);

            expect(mockWorkitemService.CreateWorkItem).toHaveBeenCalledWith(mockWorkItemDto);
            expect(result).toEqual(mockWorkitem);
        });

    });
    describe('updateWorkItem()', () => {

        it('it updates work item by id', async () => {
            mockWorkitemService.UpdateWorkItem.mockReturnValue(mockWorkitem);

            const result = await controller.updateWorkItem(mockWorkitem.id, mockUpdateWorkItemDto);

            expect(mockWorkitemService.UpdateWorkItem).toHaveBeenCalledWith(mockWorkitem.id, mockUpdateWorkItemDto);
            expect(result).toEqual(mockWorkitem);
        });

    });
    describe('delteWorkItem()', () => {

        it('it delete work item by id', async () => {
            let mockResultString = `Work item id ${mockWorkitem.id} has been deleted`;
            mockWorkitemService.DeleteWorkItem.mockReturnValue(mockWorkitem);

            const result = await controller.deleteWorkItem(mockWorkitem.id);

            expect(mockWorkitemService.DeleteWorkItem).toHaveBeenCalledWith(mockWorkitem.id);
            expect(result).toEqual(mockResultString);
        });

    });


});
