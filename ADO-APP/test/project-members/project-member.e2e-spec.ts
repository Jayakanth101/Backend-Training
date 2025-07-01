import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from "supertest";
import { mockProjectdto, mockProjectMemberDto, mockUpdateProjectMemberRoleDto } from "../../src/mock-datas";
import { ProjectMemberEntity } from "../../src/tables/project-member/project-member.entity";
import { ProjectMemberModule } from "../../src/tables/project-member/project-member.module";
import { createTestApp } from "../../test/setup";
import { TestHelper } from "../../test/utils/test-helper";
import { Repository } from "typeorm";
import { UsersModule } from "../../src/users/users.module";
import { ProjectModule } from "../../src/tables/project/project.module";
import { ProjectMemberDto } from "src/tables/project-member/dto/project-member.dto";
import { User } from "../../src/users/users.entity";
import { ProjectEntity } from "../../src/tables/project/project.entity";

let app: INestApplication;
let memberRepo: Repository<ProjectMemberEntity>;
let userRepo: Repository<User>;
let projectRepo: Repository<ProjectEntity>;
let server: any;

describe("Project member module E2E", () => {
    beforeAll(async () => {
        app = await createTestApp([ProjectMemberModule, UsersModule, ProjectModule]);
        server = app.getHttpServer();
        memberRepo = app.get<Repository<ProjectMemberEntity>>(getRepositoryToken(ProjectMemberEntity));
        userRepo = app.get<Repository<User>>(getRepositoryToken(User));
        projectRepo = app.get<Repository<ProjectEntity>>(getRepositoryToken(ProjectEntity));
    });
    afterAll(async () => {
        await app.close()
    });

    describe("POST /members", () => {
        it("Should create a project member record", async () => {
            const res = await TestHelper.createProjectMember(app);
            expect(res.body).toHaveProperty("role");
            expect(res.status).toBe(201);
        });

        it("Should not create project member because it is already exist", async () => {
            const user = await TestHelper.createUser(app);
            const project = await TestHelper.createProject(app);

            let mockMemberData: ProjectMemberDto = {
                ...mockProjectMemberDto,
                user_id: Number(user.body.id),
                project_id: Number(project.body.id)
            }

            const res = await request(server).post("/members").send(mockMemberData);
            expect(res.status).toBe(400);

        });
    });

    describe("GET /members/project/:projectId", () => {
        it("Should get project member by project Id", async () => {

            const projectMember = await TestHelper.createProjectMember(app);
            const projectId = projectMember.body.project.project_id;

            const res = await request(server).get(`/members/project/${projectId}`);

            expect(res.status).toBe(200);
            expect(res.body[0]).toHaveProperty('user_id');
            expect(res.body[0]).toHaveProperty('user_name');
            expect(res.body[0]).toHaveProperty('role');
        });

        it("Should not get project by non existing Id", async () => {
            await TestHelper.createProjectMember(app);
            const res = await request(server).get(`/members/project/9999`);


            expect(res.status).toBe(404);
        });
    });

    describe("GET /members/user/:userId", () => {
        it("should get member projects by user Id", async () => {

            const projectMember = await TestHelper.createProjectMember(app);
            const userId = projectMember.body.user.id;

            const res = await request(server).get(`/members/user/${userId}`);

            expect(res.status).toBe(200);
            expect(res.body[0]).toHaveProperty("project_id");
            expect(res.body[0]).toHaveProperty("project_name");

        });
        it("Should not get project by non existing Id", async () => {
            await TestHelper.createProjectMember(app);
            const res = await request(server).get(`/members/user/9999`);

            expect(res.status).toBe(404);
        });
    });

    describe("PUT /:projectId/:userId", () => {
        it("should update the project membership by project ID and user ID", async () => {
            const projectMember = await TestHelper.createProjectMember(app);
            const project_id = projectMember.body.project.project_id;
            const user_id = projectMember.body.user.id;

            let newPMdata = { ...mockUpdateProjectMemberRoleDto };

            const res = await request(server).put(`/members/${project_id}/${user_id}`).send(newPMdata);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("role");
        });
        it("Should not update project by non existing Id", async () => {
            await TestHelper.createProjectMember(app);
            let newPMdata = { ...mockUpdateProjectMemberRoleDto };
            const res = await request(server).put(`/members/8888/9999`).send(newPMdata);

            expect(res.body.statusCode).toBe(404);
        });
    });

    describe("DELETE /:projectId/:userId", () => {
        it("It should successfully remove the project membership by projectId and userId", async () => {
            const projectMember = await TestHelper.createProjectMember(app);
            const projectId = projectMember.body.project.project_id;
            const userId = projectMember.body.user.id;
            const res = await request(server).delete(`/members/${projectId}/${userId}`);

            expect(res.status).toBe(200);
        });
        it("Cant delete project by non existing Id", async () => {
            await TestHelper.createProjectMember(app);
            const res = await request(server).delete(`/members/8888/9999`);

            expect(res.body.statusCode).toBe(404);
        });

    });

});
