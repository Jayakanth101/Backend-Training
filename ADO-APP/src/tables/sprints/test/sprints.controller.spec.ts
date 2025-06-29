import { Test } from "@nestjs/testing";
import { SprintsController } from "../sprints.controller";
import { SprintService } from "../sprints.service";
import { mockProject, mockSprint, mockSprintDto, mockUpdateSprintDto } from "../../../mock-datas";

describe('SprintsController', () => {

    let mockProjectMemberService = {
        createSprint: jest.fn(),
        getAllSprint: jest.fn(),
        deleteSprint: jest.fn(),
        getSprintById: jest.fn(),
        updateSprint: jest.fn()
    }
    let controller: SprintsController;
    beforeEach(async () => {


        const module = await Test.createTestingModule({
            controllers: [SprintsController],
            providers: [
                { provide: SprintService, useValue: mockProjectMemberService }
            ]
        }).compile();
        controller = module.get<SprintsController>(SprintsController);
    });

    describe('createSprint()', () => {
        it('it creates a sprint by using project id', async () => {
            mockProjectMemberService.createSprint.mockReturnValue(mockSprint);
            const result = await controller.createSprint(mockProject.project_id, mockSprintDto);

            expect(mockProjectMemberService.createSprint).toHaveBeenCalledWith(mockProject.project_id, mockSprintDto);
            expect(result).toEqual(mockSprint);
        });
    });
    describe('findSprint()', () => {
        it('it gets all sprints', async () => {
            mockProjectMemberService.getAllSprint.mockResolvedValue([mockSprint]);

            const result = await controller.getAllSprint();;
            expect(mockProjectMemberService.getAllSprint).toHaveBeenCalledWith();
            expect(result).toEqual([mockSprint]);
        });;

        it('it gets a sprint by id', async () => {
            mockProjectMemberService.getSprintById.mockResolvedValue(mockSprint);
            const result = await controller.getSprintById(mockSprint.id);

            expect(mockProjectMemberService.getSprintById).toHaveBeenCalledWith(mockSprint.id);
            expect(result).toEqual(mockSprint);
        });
    });
    describe('updateSprint()', () => {
        it('it updates a sprint name by id', async () => {
            mockProjectMemberService.updateSprint.mockResolvedValue(mockSprint);

            const result = await controller.updateSprintName(mockProject.project_id, mockUpdateSprintDto);

            expect(mockProjectMemberService.updateSprint).toHaveBeenCalledWith(mockProject.project_id, mockUpdateSprintDto);
            expect(result).toEqual(mockSprint);
        });
    });
    describe('deleteSprint()', () => {
        it('delete a sprint by id', async () => {
            const mockResultString = `Successfully deleted sprint with id ${mockSprint.id}`;
            mockProjectMemberService.deleteSprint.mockResolvedValue(mockResultString);

            const result = await controller.deleteSprint(mockSprint.id);

            expect(mockProjectMemberService.deleteSprint).toHaveBeenCalledWith(mockSprint.id);
            expect(result).toEqual(mockResultString);
        });
    });
});
