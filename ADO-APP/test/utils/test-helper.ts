import { INestApplication } from "@nestjs/common";
import { CreateUserDto } from "../../src/users/dto/users.dto";
import * as request from "supertest";
import { mockProjectdto, mockProjectMemberDto, mockSprintDto, mockWorkItemDto } from "../../src/mock-datas";
import { ProjectEntityDto } from "../../src/tables/project/dto/project.dto";
import { CreateWorkItemDto } from "../../src/work-items/dto/create-work-item-dto";
import { ProjectMemberDto } from "src/tables/project-member/dto/project-member.dto";
import { SprintDto } from "src/tables/sprints/dto/sprints.dto";

export class TestHelper {


    static async deleteUser(app: INestApplication, Id: number) {
        return await request(app.getHttpServer()).delete(`/user/${Id}`);
    }

    static async createProject(app: INestApplication, overrides: Partial<ProjectEntityDto> = {}) {
        const dto = overrides;
        let server = app.getHttpServer();
        return await request(server).post("/project").send(dto);
    }

    static async createUser(app: INestApplication, overrides: Partial<CreateUserDto> = {}) {
        const timestamp = Date.now();
        const uniqueDto: CreateUserDto = {
            displayname: `User_${timestamp}`,
            email: `user_${timestamp}@test.com`,
            password: 'password',
            ...overrides
        };
        const res = await request(app.getHttpServer()).post('/user')
            .send(uniqueDto);
        return res;
    }

    static async createProjectMember(app: INestApplication, userId?: number, projectId?: number) {
        // Fallback: auto-create user and project only if not provided
        if (!userId || !projectId) {
            const user = await this.createUser(app);
            const project = await this.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user.id,
            });
            userId = user.body.user.id;
            projectId = project.body.project.project_id;
        }

        const payload = {
            ...mockProjectMemberDto,
            user_id: userId,
            project_id: projectId,
        };

        const res = await request(app.getHttpServer()).post("/members").send(payload);
        return res;
    }
    static async createWorkitem(app: INestApplication, overrides: Partial<CreateWorkItemDto> = {}) {
        const createdBy = await TestHelper.createUser(app);
        const createdProject = await TestHelper.createProject(app, mockProjectdto);

        const projectId = createdProject.body.project.project_id;
        const creatorId = createdBy.body.user.id;

        // Use override assigned_to if provided
        let assignedProjectMemberId = overrides.assigned_to;

        // If not provided, create a default one
        if (!assignedProjectMemberId) {
            const assignedToUser = await TestHelper.createUser(app);
            const addedMember = await TestHelper.addUserToProject(app, {
                user_id: assignedToUser.body.user.id,
                project_id: projectId,
            });
            assignedProjectMemberId = addedMember.body.project_member.id;
        }
        if (!assignedProjectMemberId) {
            throw new Error("assigned_to (project member ID) is required to create work item");
        }


        const mockData: CreateWorkItemDto = {
            ...mockWorkItemDto,
            ...overrides,
            created_by: creatorId,
            project_id: projectId,
            assigned_to: assignedProjectMemberId,
        };

        const res = await request(app.getHttpServer())
            .post("/workitems")
            .send(mockData);

        return res;
    }

    static async createSprint(app: INestApplication, overrides: Partial<SprintDto> = {}) {

        let mockData: SprintDto = { ...mockSprintDto, ...overrides };

        let server = app.getHttpServer();
        return await request(server).post(`/sprint/${overrides.project_id}`).send(mockData);
    }

    static async addUserToProject(app: INestApplication, overrides: Partial<ProjectMemberDto> = {}) {

        const mockMember = { ...mockProjectMemberDto, ...overrides };

        return await request(app.getHttpServer())
            .post('/members')
            .send(mockMember);
    }

}
