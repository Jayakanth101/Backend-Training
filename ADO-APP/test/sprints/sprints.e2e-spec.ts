import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { createTestApp } from "../setup";
import { SprintsModule } from "../../src/tables/sprints/sprints.module";
import { ProjectModule } from "../../src/tables/project/project.module";
import { SprintEntity } from "../../src/tables/sprints/sprints.entity";
import { ProjectEntity } from "../../src/tables/project/project.entity";
import { SprintDto } from "../../src/tables/sprints/dto/sprints.dto";
import { mockProjectdto, mockSprintDto, mockUpdateSprintDto } from "../../src/mock-datas";
import { TestHelper } from "../utils/test-helper";
import { User } from "../../src/users/users.entity";
import { UsersModule } from "../../src/users/users.module";

describe("Sprint module - E2E testing", () => {
    let app: INestApplication;
    let server: any;
    let sprintRepo: Repository<SprintEntity>;
    let projectRepo: Repository<ProjectEntity>;
    let userRepo: Repository<User>;

    beforeAll(async () => {
        app = await createTestApp([SprintsModule, ProjectModule, UsersModule]);
        server = app.getHttpServer();
        sprintRepo = app.get<Repository<SprintEntity>>(getRepositoryToken(SprintEntity));
        projectRepo = app.get<Repository<ProjectEntity>>(getRepositoryToken(ProjectEntity));
        userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    });

    afterAll(async () => {
        await app.close();
    });

    describe("POST /sprint/:id", () => {
        it("Should create sprint by project ID", async () => {
            const userRes = await TestHelper.createUser(app);
            const userId = userRes.body.user?.id;


            const createdProject = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: userId,
            });

            expect(createdProject.status).toBe(201);
            const projectId = createdProject.body.project?.project_id;
            expect(projectId).toBeDefined();

            const sprintData: SprintDto = { ...mockSprintDto, project_id: projectId };
            const createdSprint = await TestHelper.createSprint(app, sprintData);

            expect(createdSprint.status).toBe(201);
            expect(createdSprint.body.Sprint).toHaveProperty("id");
        });

        it("Should fail to create a sprint for non existing project id", async () => {
            const res = await request(server).post(`/sprint/9999`).send(mockSprintDto);
            expect(res.status).toBe(404);
        });
    });

    describe("GET /sprint/", () => {
        it("Should get all sprints", async () => {
            const user = await TestHelper.createUser(app);
            const createdProject = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user?.id,
            });
            const projectId = createdProject.body.project?.project_id;
            await TestHelper.createSprint(app, { ...mockSprintDto, project_id: projectId });

            const res = await request(server).get(`/sprint`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.Sprint)).toBe(true);
        });
    });

    describe("GET /sprint/:id", () => {
        it("Should return a sprint by sprint ID", async () => {
            const user = await TestHelper.createUser(app);
            const createdProject = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user?.id,
            });
            const projectId = createdProject.body.project?.project_id;
            const createdSprint = await TestHelper.createSprint(app, {
                ...mockSprintDto,
                project_id: projectId,
            });
            const sprint_id = createdSprint.body.Sprint?.id;

            const res = await request(server).get(`/sprint/${sprint_id}`);
            expect(res.status).toBe(200);
            expect(res.body.Sprint).toHaveProperty("id");
        });
    });

    describe("GET /sprint/project/:id", () => {
        it("Should return a sprint by project ID", async () => {
            const user = await TestHelper.createUser(app);
            const createdProject = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user?.id,
            });
            const projectId = createdProject.body.project?.project_id;
            await TestHelper.createSprint(app, { ...mockSprintDto, project_id: projectId });

            const res = await request(server).get(`/sprint/project/${projectId}`);
            expect(res.status).toBe(200);
            expect(res.body.Sprint).toHaveProperty("id");
        });
    });

    describe("PUT /sprint/:id", () => {
        it("Should update a sprint detail by sprint ID", async () => {
            const user = await TestHelper.createUser(app);
            const createdProject = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user?.id,
            });
            const projectId = createdProject.body.project?.project_id;
            const createdSprint = await TestHelper.createSprint(app, {
                ...mockSprintDto,
                project_id: projectId,
            });
            const sprintId = createdSprint.body.Sprint?.id;

            const res = await request(server).put(`/sprint/${sprintId}`).send(mockUpdateSprintDto);
            expect(res.status).toBe(200);
            expect(res.body.Sprint).toHaveProperty("sprint_name", mockUpdateSprintDto.sprint_name);
        });
    });

    describe("DELETE /sprint/:id", () => {
        it("Should delete a sprint", async () => {
            const user = await TestHelper.createUser(app);
            const createdProject = await TestHelper.createProject(app, {
                ...mockProjectdto,
                project_creator_id: user.body.user?.id,
            });
            const projectId = createdProject.body.project?.project_id;
            const createdSprint = await TestHelper.createSprint(app, {
                ...mockSprintDto,
                project_id: projectId,
            });
            const sprintId = createdSprint.body.Sprint?.id;

            const res = await request(server).delete(`/sprint/${sprintId}`);
            expect(res.status).toBe(200);
        });
    });
});

