import { Repository } from "typeorm";
import { ProjectService } from "../project.service"
import { ProjectEntity } from "../project.entity";
import { User } from "src/users/users.entity";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProjectEntityDto } from "../dto/project.dto";


describe('ProjectService', () => {
    let service: ProjectService;
    let repo: Repository<ProjectEntity>;

    const mockUser: User = {
        id: 1,
        displayname: 'Alice',
        email: 'alice@example.com',
        password: 'securePass123',
        created_projects: [],
        assigned_projects: [],
        project_memberships: [],
        created_workitems: [],
    }

    const mockProject: ProjectEntity = {
        project_id: 3,
        project_description: "Testing project",
        project_name: "CRUD app",
        sprints: [],
        work_items: [],
        members: [],
        project_creator: mockUser
    }
    const mockProjects: ProjectEntity[] = [
        { project_id: 1, project_name: 'Alpha', project_description: 'Test A', work_items: [], sprints: [], project_creator: mockUser, members: [] },
        { project_id: 2, project_name: 'Beta', project_description: 'Test B', work_items: [], sprints: [], project_creator: mockUser, members: [] }
    ];
    const updatedMockProject: ProjectEntity = {
        ...mockProject,
        project_description: "Testing project (update functionality)",
    }

    const mockProjectRepo = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProjectService,
                {
                    provide: getRepositoryToken(ProjectEntity),
                    useValue: mockProjectRepo,
                }
            ]
        }).compile();

        service = module.get<ProjectService>(ProjectService);
        repo = module.
            get<Repository<ProjectEntity>>
            (getRepositoryToken(ProjectEntity));
    });

    describe('create()', () => {
        it('it should create project', async () => {
            const dto: ProjectEntityDto = {
                project_name: 'CRUD app',
                project_creator_id: 1,
                project_description: "CRUD app using nest js",
                members: []
            }

            jest.spyOn(repo, 'create').mockReturnValue(mockProject as any);
            jest.spyOn(repo, 'save').mockResolvedValue(mockProject as any);

            const result = await service.createProject(dto);
            expect(repo.create).toHaveBeenCalledWith(dto);
            expect(repo.save).toHaveBeenCalledWith(mockProject);
            expect(result).toEqual(mockProject)
        });

        it('it should get a project by Id', async () => {
            jest.spyOn(repo, 'findOne').mockResolvedValueOnce(mockProject as any);
            const result = await service.findProject(mockProject.project_id);
            expect(repo.findOne).toHaveBeenCalledWith({
                where: {
                    project_id: mockProject.project_id
                },
                relations: ["members", "work_items"],
            });
            expect(result).toEqual(mockProject);
        });

        it('it should update the project by id', async () => {
            jest.spyOn(repo, 'findOne').mockResolvedValueOnce(mockProject as any);
            jest.spyOn(repo, 'save').mockResolvedValue(mockProject as any);

            const result = await service.updateProject(updatedMockProject.project_id, updatedMockProject as any);
            expect(repo.save).toHaveBeenCalledWith(updatedMockProject);
            expect(result).toEqual(updatedMockProject);

        });

        it('it shoud find all projects', async () => {
            jest.spyOn(repo, 'find').mockResolvedValue(mockProject as any);
            const result = await service.findAllProjects();
            expect(repo.find).toHaveBeenCalled();
            expect(result).toEqual(mockProjects);
        });

        it('it should delete a project by id', async () => {
            jest.spyOn(service, 'findProject').mockResolvedValue(mockProject as any);
            jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);
            const result = await service.deleteProject(mockProject.project_id);
            expect(repo.delete).toHaveBeenCalledWith(mockProject.project_id);
            expect(result).toEqual(`${mockProject.project_id} is deleted successfully`);
        });

    });


})
