import { Test } from "@nestjs/testing"
import { ProjectController } from "../project.controller"
import { ProjectService } from "../project.service"
import { mockProject, mockProjectdto } from "src/mock-datas"
import { mockUpdateProjectDto } from "src/mock-datas/dto/mock.update-project.dto"

describe('ProjectController()', () => {

    const mockProjectService = {
        createProject: jest.fn(),
        findProject: jest.fn(),
        findAllProjects: jest.fn(),
        updateProject: jest.fn(),
        deleteProject: jest.fn()
    }
    let controller: ProjectController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [ProjectController],
            providers: [{
                provide: ProjectService,
                useValue: mockProjectService
            }]
        }).compile();

        controller = module.get<ProjectController>(ProjectController);
    })

    describe('createProject()', () => {
        it('it creates a project', async () => {
            mockProjectService.createProject.mockReturnValue(mockProject);

            const result = await controller.createProject(mockProjectdto)

            expect(mockProjectService.createProject).toHaveBeenCalledWith(mockProjectdto);
            expect(result).toEqual(mockProject);
        });
        it('it find a project by id', async () => {
            mockProjectService.findProject.mockResolvedValue(mockProject);

            const result = await controller.findProject(mockProject.project_id);

            expect(mockProjectService.findProject).toHaveBeenCalledWith(mockProject.project_id);
            expect(result).toEqual(mockProject);
        });
        it('it find all projects ', async () => {
            mockProjectService.findAllProjects.mockResolvedValue([mockProject]);

            const result = await controller.findAllProjects();

            expect(mockProjectService.findAllProjects).toHaveBeenCalledWith();
            expect(result).toEqual([mockProject]);
        });
        it('it update a project by id', async () => {
            mockProjectService.updateProject.mockResolvedValue(mockProject);

            const result = await controller.updateProject(mockProject.project_id, mockUpdateProjectDto);

            expect(mockProjectService.updateProject).toHaveBeenCalledWith(mockProject.project_id, mockUpdateProjectDto);
            expect(result).toEqual(mockProject);
        });
        it('it delete a project by id', async () => {
            const mockResultString = `Successfully project id ${mockProject.project_id} deleted`;
            mockProjectService.deleteProject.mockResolvedValue(mockResultString);

            const result = await controller.deleteProject(mockProject.project_id);

            expect(mockProjectService.deleteProject).toHaveBeenCalledWith(mockProject.project_id);
            expect(result).toEqual(mockResultString);
        });

    });

})
