import { INestApplication } from "@nestjs/common";
import { createTestApp } from "../setup";
import { SprintsModule } from "../../src/tables/sprints/sprints.module";
import { Repository } from "typeorm";
import { SprintEntity } from "../../src/tables/sprints/sprints.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TestHelper } from "../utils/test-helper";
import { mockProjectdto, mockSprint, mockSprintDto, mockUpdateSprintDto } from "../../src/mock-datas";
import { SprintDto } from "../../src/tables/sprints/dto/sprints.dto";
import { ProjectModule } from "../../src/tables/project/project.module";
import * as request from "supertest";
import { ProjectEntity } from "../../src/tables/project/project.entity";
import { async } from "rxjs";
import { mock } from "node:test";

describe("Sprint module - E2E testing", () => {
    let app: INestApplication;
    let server: any;
    let sprintRepo: Repository<SprintEntity>;
    let projectRepo: Repository<ProjectEntity>;

    beforeAll(async () => {
        app = await createTestApp([SprintsModule, ProjectModule]);
        server = app.getHttpServer();
        sprintRepo = app.get<Repository<SprintEntity>>(getRepositoryToken(SprintEntity));
        projectRepo = app.get<Repository<ProjectEntity>>(getRepositoryToken(ProjectEntity));
    });

    afterAll(async () => {
        await app.close();
    });

    describe("POST /sprint/:id", () => {
        it("Should create sprint by project ID", async () => {

            const createdProject = await TestHelper.createProject(app, mockProjectdto);
            const projectId = createdProject.body.project_id;
            const mockdata: SprintDto = { ...mockSprintDto, project_id: projectId };

            const createdSprint = await TestHelper.createSprint(app, mockdata);
            expect(createdSprint.status).toBe(201);
        });
        it("Should fail to create a sprint for non existing project id", async () => {
            const res = await request(server).get(`/project/9999`);
            expect(res.status).toBe(404);
        });
    });

    describe("GET /sprint/", () => {
        it("Should get all sprints", async () => {
            await TestHelper.createSprint(app, mockSprintDto);
            const res = await request(server).get(`/sprint`);
            expect(res.status).toBe(200);
        });
    });

    describe("GET /sprint/:id", () => {
        it("Should return a sprint by sprint ID ", async () => {
            const createdSprint = await TestHelper.createSprint(app, mockSprintDto);
            const sprint_id = createdSprint.body.id;

            const res = await request(server).get(`/sprint/${sprint_id}`);

            expect(res.status).toBe(200);
        });
    });
    describe("GET /sprint/project/:id", () => {
        it("Should return a sprint by project ID ", async () => {
            const createdProject = await TestHelper.createProject(app, mockProjectdto);
            const projectId = createdProject.body.project_id;

            await TestHelper.createSprint(app, { ...mockSprintDto, project_id: projectId });

            const res = await request(server).get(`/sprint/project/${projectId}`);

            expect(res.status).toBe(200);
        });
    });


    describe("PUT /sprint/:id", () => {
        it("Should update a sprint detaild by sprint ID", async () => {
            const createdSprint = await TestHelper.createSprint(app, mockSprintDto);
            const sprintId = createdSprint.body.id;

            const mockData = { ...mockUpdateSprintDto };

            const res = await request(server).put(`/sprint/${sprintId}`).send(mockData);
            expect(res.status).toBe(200);
            expect(res.body.sprint_name).toBe(mockData.sprint_name);
            expect(new Date(res.body.start_date)).toEqual(mockData.start_date);

        });
    });
});
