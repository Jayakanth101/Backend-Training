import { INestApplication } from "@nestjs/common";
import { CreateUserDto } from "../../src/users/dto/users.dto";
import { mockCreateUserDto } from "../../src/mock-datas/dto/mock.crate-user.dto";
import * as request from "supertest";
import { mockProjectdto, mockProjectMemberDto, mockSprintDto, mockWorkItemDto } from "../../src/mock-datas";
import { ProjectEntityDto } from "../../src/tables/project/dto/project.dto";
import { CreateWorkItemDto } from "../../src/work-items/dto/create-work-item-dto";
import { ProjectMemberDto } from "src/tables/project-member/dto/project-member.dto";
import { SprintDto } from "src/tables/sprints/dto/sprints.dto";

export class TestHelper {

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

    static async deleteUser(app: INestApplication, Id: number) {
        return await request(app.getHttpServer()).delete(`/user/${Id}`);
    }

    static async createProject(app: INestApplication, overrides: Partial<ProjectEntityDto> = {}) {
        const dto = overrides;
        let server = app.getHttpServer();
        return await request(server).post("/project").send(dto);
    }


    static async createProjectMember(app: INestApplication, overrides: Partial<ProjectMemberDto> = {}) {
        const user = await TestHelper.createUser(app);
        expect(user.status).toBe(201);
        expect(user.body).toHaveProperty("id");

        const project = await TestHelper.createProject(app, mockProjectdto);
        expect(project.status).toBe(201);
        expect(project.body).toHaveProperty("project_id");

        let mockMemberData: ProjectMemberDto = {
            user_id: Number(user.body.id),
            project_id: Number(project.body.project_id),
            role: "admin"
        }
        return await request(app.getHttpServer()).post("/members").send(mockMemberData);

    }

    static async createWorkitem(app: INestApplication, overrides: Partial<CreateWorkItemDto> = {}) {
        const createdBy = await TestHelper.createUser(app);
        const createdProject = await TestHelper.createProject(app, mockProjectdto);
        const projectId = createdProject.body.project_id;
        const mockdata: SprintDto = { ...mockSprintDto, project_id: projectId };
        const createdSprint = await TestHelper.createSprint(app, mockdata);

        const creatorId = createdBy.body.id;
        const sprintId = createdSprint.body.id;

        let server = app.getHttpServer();

        let mockData: CreateWorkItemDto = {
            ...mockWorkItemDto,
            created_by: creatorId,
            project_id: projectId,
            sprint_id: sprintId
        }
        return await request(server).post("/workitems").send(mockData);
    }


    static async createSprint(app: INestApplication, overrides: Partial<SprintDto> = {}) {

        let mockData: SprintDto = { ...mockSprintDto, ...overrides };

        let server = app.getHttpServer();
        return await request(server).post(`/sprint/${overrides.project_id}`).send(mockData);
    }

}
