import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProjectMemberService } from "../project-member.service";
import { ProjectMemberEntity } from "../project-member.entity";

import {
    mockProject,
    mockProjectMemberEntity,
    mockProjectMemberDto,
    mockUser,
    mockProjectMemberResponseDto,
    mockProjectMembers,
    mockMembersProjectResponseDto,
} from "../../../mock-datas";

describe('ProjectMemberService', () => {
    let service: ProjectMemberService;
    let mockPmRepo: Partial<Repository<ProjectMemberEntity>>;

    beforeEach(async () => {
        mockPmRepo = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(), // Important: used in removeProjectMembership
        };

        const module = await Test.createTestingModule({
            providers: [
                ProjectMemberService,
                {
                    provide: getRepositoryToken(ProjectMemberEntity),
                    useValue: mockPmRepo,
                },
            ],
        }).compile();

        service = module.get<ProjectMemberService>(ProjectMemberService);
    });

    describe('createProjectMember()', () => {
        it('creates a project member', async () => {
            (mockPmRepo.create as jest.Mock).mockReturnValue(mockProjectMemberEntity);
            (mockPmRepo.save as jest.Mock).mockResolvedValue(mockProjectMemberEntity);

            const result = await service.createProjectMember(mockProjectMemberDto);

            expect(mockPmRepo.create).toHaveBeenCalledWith(mockProjectMemberDto);
            expect(mockPmRepo.save).toHaveBeenCalledWith(mockProjectMemberEntity);

            expect(result).toEqual(
                `User ${mockProjectMemberDto.user_id} added as a ${mockProjectMemberDto.role} to the project ${mockProjectMemberDto.project_id}`
            );
        });
    });

    describe('getAllProjectMembers()', () => {
        it('gets all project members by project id', async () => {
            (mockPmRepo.find as jest.Mock).mockResolvedValue(mockProjectMembers);

            const result = await service.getAllProjectMembers(mockProject.project_id);

            expect(mockPmRepo.find).toHaveBeenCalledWith({
                where: { project: { project_id: mockProject.project_id } },
                relations: ['user'],
            });

            expect(result).toEqual([mockProjectMemberResponseDto]);
        });
    });

    describe('getAllMembersProject()', () => {
        it('gets all projects by user id', async () => {
            (mockPmRepo.find as jest.Mock).mockResolvedValue(mockProjectMembers);

            const result = await service.getAllMembersProject(mockUser.id);

            expect(mockPmRepo.find).toHaveBeenCalledWith({
                where: { user: { id: mockUser.id } },
                relations: ['project'],
            });

            expect(result).toEqual([mockMembersProjectResponseDto]);
        });
    });

    describe('updateProjectMembership()', () => {
        it('updates a project member', async () => {
            (mockPmRepo.findOne as jest.Mock).mockResolvedValue(mockProjectMemberEntity);
            const updatedEntity = { ...mockProjectMemberEntity, role: "member" };
            (mockPmRepo.save as jest.Mock).mockResolvedValue(updatedEntity);

            const result = await service.updateProjectMembership(
                mockProject.project_id,
                mockUser.id,
                "member"
            );

            expect(mockPmRepo.findOne).toHaveBeenCalledWith({
                where: {
                    project: { project_id: mockProject.project_id },
                    user: { id: mockUser.id },
                },
            });

            expect(mockPmRepo.save).toHaveBeenCalledWith(updatedEntity);
            expect(result).toEqual({
                user_id: updatedEntity.user.id,
                project_id: updatedEntity.project.project_id,
                role: updatedEntity.role,
            });
        });
    });

    describe('removeProjectMembership()', () => {
        it('removes project membership by user id and project id', async () => {
            (mockPmRepo.findOne as jest.Mock).mockResolvedValue(mockProjectMemberEntity);
            (mockPmRepo.remove as jest.Mock).mockResolvedValue(mockProjectMemberEntity);

            const result = await service.removeProjectMembership(mockProject.project_id, mockUser.id);

            expect(mockPmRepo.findOne).toHaveBeenCalledWith({
                where: {
                    project: { project_id: mockProject.project_id },
                    user: { id: mockUser.id },
                },
            });

            expect(mockPmRepo.remove).toHaveBeenCalledWith(mockProjectMemberEntity);
            expect(result).toEqual(
                `Successfully a member ${mockUser.id} removed from a project ${mockProject.project_id}`
            );
        });
    });
});

