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
import { DataSource } from "typeorm";
import { clearDatabase } from "../../test/utils/database-helper";

let app: INestApplication;
let memberRepo: Repository<ProjectMemberEntity>;
let userRepo: Repository<User>;
let projectRepo: Repository<ProjectEntity>;
let server: any;
let dataSource: DataSource;

describe("Project member module E2E", () => {
    beforeAll(async () => {
        app = await createTestApp([
            ProjectMemberModule,
            UsersModule,
            ProjectModule,
        ]);
        server = app.getHttpServer();

        dataSource = app.get(DataSource);
        memberRepo = app.get<Repository<ProjectMemberEntity>>(
            getRepositoryToken(ProjectMemberEntity)
        );
        userRepo = app.get<Repository<User>>(getRepositoryToken(User));
        projectRepo = app.get<Repository<ProjectEntity>>(
            getRepositoryToken(ProjectEntity)
        );
    });
    afterAll(async () => {
        await app.close();
    });
    beforeEach(async () => {
        await clearDatabase(dataSource);;
    })


    describe("POST /members", () => {
        it("Should create a project member record", async () => {
            const user = await TestHelper.createUser(app);
            expect(user.status).toBe(201);
            expect(user.body.user).toHaveProperty("id");

            const project = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user.id,
            });
            expect(project.status).toBe(201);
            expect(project.body.project).toHaveProperty("project_id");

            const res = await TestHelper.createProjectMember(app, user.body.user.id, project.body.project.project_id);
            expect(res.status).toBe(201);
            expect(res.body.project_member).toHaveProperty("role");
        });

        it("Should not create project member because it already exists", async () => {
            const user = await TestHelper.createUser(app);
            const project = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user.id,
            });

            const mockMemberData: ProjectMemberDto = {
                ...mockProjectMemberDto,
                user_id: user.body.user.id,
                project_id: project.body.project.project_id,
            };

            await request(server).post("/members").send(mockMemberData); // Create once
            const res = await request(server).post("/members").send(mockMemberData); // Duplicate

            expect(res.status).toBe(400);
        });
    });

    describe("GET /members/project/:projectId", () => {
        it("Should get project member by project Id", async () => {
            const user = await TestHelper.createUser(app);
            const project = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user.id,
            });
            await TestHelper.createProjectMember(app, user.body.user.id, project.body.project.project_id);

            const res = await request(server).get(`/members/project/${project.body.project.project_id}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.project_members)).toBe(true);
            expect(res.body.project_members.length).toBeGreaterThan(0);
            expect(res.body.project_members[0]).toHaveProperty("user_id");
            expect(res.body.project_members[0]).toHaveProperty("user_name");
            expect(res.body.project_members[0]).toHaveProperty("role");
        });

        it("Should not get project by non-existing Id", async () => {
            const res = await request(server).get(`/members/project/9999`);
            expect(res.status).toBe(404);
        });
    });

    describe("GET /members/user/:userId", () => {
        it("should get member projects by user Id", async () => {
            const user = await TestHelper.createUser(app);
            const project = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user.id,
            });
            await TestHelper.createProjectMember(app, user.body.user.id, project.body.project.project_id);

            const res = await request(server).get(`/members/user/${user.body.user.id}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.members_projects)).toBe(true);
            expect(res.body.members_projects.length).toBeGreaterThan(0);
            expect(res.body.members_projects[0]).toHaveProperty("project_id");
            expect(res.body.members_projects[0]).toHaveProperty("project_name");

        });

        it("Should not get project by non-existing Id", async () => {
            const res = await request(server).get(`/members/user/9999`);
            expect(res.status).toBe(404);
        });
    });

    describe("PUT /:projectId/:userId", () => {
        it("should update the project membership by project ID and user ID", async () => {
            const user = await TestHelper.createUser(app);
            const project = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user.id,
            });
            await TestHelper.createProjectMember(app, user.body.user.id, project.body.project.project_id);

            const newPMdata = { ...mockUpdateProjectMemberRoleDto };
            const res = await request(server)
                .put(`/members/${project.body.project.project_id}/${user.body.user.id}`)
                .send(newPMdata);

            expect(res.status).toBe(200);
            expect(res.body.project_member).toHaveProperty("role");
        });

        it("Should not update project by non-existing Id", async () => {
            const newPMdata = { ...mockUpdateProjectMemberRoleDto };
            const res = await request(server).put(`/members/8888/9999`).send(newPMdata);
            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /:projectId/:userId", () => {
        it("It should successfully remove the project membership by projectId and userId", async () => {
            const user = await TestHelper.createUser(app);
            const project = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user.id,
            });
            await TestHelper.createProjectMember(app, user.body.user.id, project.body.project.project_id);

            const res = await request(server).delete(`/members/${project.body.project.project_id}/${user.body.user.id}`);
            expect(res.status).toBe(200);
        });

        it("Cant delete project by non-existing Id", async () => {
            const res = await request(server).delete(`/members/8888/9999`);
            expect(res.status).toBe(404);
        });
    });
});
