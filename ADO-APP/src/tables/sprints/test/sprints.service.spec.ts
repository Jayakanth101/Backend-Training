import { Test } from "@nestjs/testing";
import { SprintEntity } from "../sprints.entity";
import { SprintService } from "../sprints.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProjectService } from "../../../tables/project/project.service";
import { ProjectEntity } from "../../../tables/project/project.entity";
import { mockProject, mockSprint, mockSprintDto, mockUser } from "../../../mock-datas";
import { UsersService } from "../../../../src/users/users.service";
import { User } from "../../../../src/users/users.entity";

describe('SprintService', () => {
    let mockService: SprintService;

    const mockSprintRepo = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn()
    };

    const mockProjectRepo = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        delete: jest.fn(),
        find: jest.fn()
    };

    const mockUserRepo = {}

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                SprintService,
                {
                    provide: getRepositoryToken(SprintEntity),
                    useValue: mockSprintRepo
                },
                ProjectService,
                {
                    provide: getRepositoryToken(ProjectEntity),
                    useValue: mockProjectRepo
                },
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo
                },

            ]
        }).compile();

        mockService = module.get<SprintService>(SprintService);
    });

    it('creates a new sprint', async () => {
        mockProjectRepo.findOneBy.mockResolvedValue(mockProject);
        mockSprintRepo.create.mockReturnValue(mockSprint);
        mockSprintRepo.save.mockResolvedValue(mockSprint);

        const result = await mockService.createSprint(mockProject.project_id, mockSprintDto);

        expect(mockProjectRepo.findOneBy).toHaveBeenCalledWith({ project_id: mockProject.project_id });
        expect(mockSprintRepo.create).toHaveBeenCalledWith({
            ...mockSprintDto,
            project: { project_id: mockSprintDto.project_id },
            location: mockSprintDto.location || mockProject.project_name,
        });
        expect(mockSprintRepo.save).toHaveBeenCalledWith(mockSprint);
        expect(result).toEqual(mockSprint);
    });

    it('gets all sprints', async () => {
        mockSprintRepo.find.mockResolvedValue([mockSprint]);

        const result = await mockService.getAllSprint();

        expect(mockSprintRepo.find).toHaveBeenCalled();
        expect(result).toEqual([mockSprint]);
    });

    it('deletes a sprint by id', async () => {
        mockSprintRepo.findOneBy.mockResolvedValue(mockSprint);
        mockSprintRepo.delete.mockResolvedValue({ affected: 1 });

        const result = await mockService.deleteSprint(mockSprint.id);

        expect(mockSprintRepo.delete).toHaveBeenCalledWith(mockSprint.id);
        expect(result).toEqual({ affected: 1 });
    });

    it('gets a sprint by id', async () => {
        mockSprintRepo.findOneBy.mockResolvedValue(mockSprint);

        const result = await mockService.getSprintById(mockSprint.id);

        expect(mockSprintRepo.findOneBy).toHaveBeenCalledWith({ id: mockSprint.id });
        expect(result).toEqual(mockSprint);
    });

    it('updates a sprint', async () => {
        const updateDto = {
            sprint_name: "Updated Sprint",
            location: "Updated Location",
            start_date: new Date(),
            end_date: new Date(),
        };

        mockSprintRepo.findOne.mockResolvedValue(mockSprint);
        mockSprintRepo.save.mockResolvedValue({ ...mockSprint, ...updateDto });

        const result = await mockService.updateSprint(mockSprint.id, updateDto);

        expect(mockSprintRepo.findOne).toHaveBeenCalledWith({
            where: { id: mockSprint.id },
            relations: ['project'],
        });

        expect(mockSprintRepo.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
        expect(result).toEqual(expect.objectContaining(updateDto));
    });
});

