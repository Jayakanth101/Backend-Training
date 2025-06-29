import { Test } from "@nestjs/testing";
import { ProjectMemberController } from "../project-member.controller";
import { ProjectMemberService } from "../project-member.service";
import { mockMembersProjectResponseDto, mockProject, mockProjectMemberDto, mockProjectMemberResponseDto, mockUpdateProjectMemberRoleDto, mockUser } from "../../../mock-datas";

describe('ProjectMemeberController()', () => {
    const mockProjectMemberService = {
        createProjectMember: jest.fn(),
        getAllProjectMembers: jest.fn(),
        getAllMembersProject: jest.fn(),
        updateProjectMembership: jest.fn(),
        removeProjectMembership: jest.fn()
    }
    let controller: ProjectMemberController;
    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [ProjectMemberController],
            providers: [
                { provide: ProjectMemberService, useValue: mockProjectMemberService }
            ]
        }).compile();
        controller = module.get<ProjectMemberController>(ProjectMemberController);
    });

    describe('createProjectMember', () => {
        it('create a project member', async () => {
            mockProjectMemberService.createProjectMember.mockReturnValue(mockProject);

            const result = await controller.createProject(mockProjectMemberDto);

            expect(mockProjectMemberService.createProjectMember).toHaveBeenCalledWith(mockProjectMemberDto);
            expect(result).toEqual(mockProject);
        })
    });
    describe('findProjectMember', () => {
        it('is gets all project members by project id', async () => {
            mockProjectMemberService.getAllProjectMembers.mockResolvedValue([mockProjectMemberResponseDto]);

            const result = await controller.getAllProjectMembers(mockProject.project_id);

            expect(mockProjectMemberService.getAllProjectMembers).toHaveBeenCalledWith(mockProject.project_id);
            expect(result).toEqual([mockProjectMemberResponseDto]);
        });

        it('it gets all projects of member by user id', async () => {
            mockProjectMemberService.getAllMembersProject.mockResolvedValue([mockMembersProjectResponseDto]);

            const result = await controller.getAllMembersProject(mockUser.id);

            expect(mockProjectMemberService.getAllMembersProject).toHaveBeenCalledWith(mockProject.project_id);
            expect(result).toEqual([mockMembersProjectResponseDto]);
        });

    });
    describe('updateProjectMember', () => {
        it('it updates project membership by using user id and project id', async () => {
            mockProjectMemberService.updateProjectMembership.mockResolvedValue(mockProjectMemberDto);

            const result = await mockProjectMemberService.updateProjectMembership(mockProject.project_id, mockUser.id, mockUpdateProjectMemberRoleDto);

            expect(mockProjectMemberService.updateProjectMembership).toHaveBeenCalledWith(mockProject.project_id, mockUser.id, mockUpdateProjectMemberRoleDto);
            expect(result).toEqual(mockProjectMemberDto);

        });
    });
    describe('deleteProjectMember', () => {
        it('it remove project membership by using user id and project id', async () => {
            const mockResultString = `Successfully a member ${mockUser.id} removed from a project ${mockProject.project_id}`;
            mockProjectMemberService.removeProjectMembership.mockResolvedValue(mockResultString);

            const result = await mockProjectMemberService.removeProjectMembership(mockProject.project_id, mockUser.id);

            expect(mockProjectMemberService.removeProjectMembership).toHaveBeenCalledWith(mockProject.project_id, mockUser.id);
            expect(result).toEqual(mockResultString);

        });
    });

});
