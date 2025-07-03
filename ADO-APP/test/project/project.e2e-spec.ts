import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { createTestApp } from "../setup";
import { ProjectModule } from "../../src/tables/project/project.module";
import { mockProjectdto, mockUser } from "../../src/mock-datas";
import { DataSource, Repository } from "typeorm";
import { ProjectEntity } from "../../src/tables/project/project.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TestHelper } from "../../test/utils/test-helper";
import { clearDatabase } from "../../test/utils/database-helper";
import { UsersModule } from "../../src/users/users.module";
import { mockUpdateProjectDto } from "../../src/mock-datas/dto/mock.update-project.dto";

describe("ProjectModule E2E", () => {
    let app: INestApplication;
    let server: any;
    let projectRepo: Repository<ProjectEntity>;
    let dataSource: DataSource;

    beforeAll(async () => {
        app = await createTestApp([ProjectModule, UsersModule]);
        server = app.getHttpServer();
        projectRepo = app.get<Repository<ProjectEntity>>(getRepositoryToken(ProjectEntity));
        dataSource = app.get(DataSource);
    });
    beforeEach(async () => {
        await clearDatabase(dataSource);
    });


    afterAll(async () => {
        await app.close();
    });

    describe("POST /project", () => {
        it('should create a project successfully', async () => {
            const user = await TestHelper.createUser(app);
            const projectDto = { ...mockProjectdto, project_creator_id: user.body.user.id };

            const res = await TestHelper.createProject(app, projectDto);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("project");
            expect(res.body.project).toHaveProperty("project_id");
        });

        it('should fail with invalid data (missing required field)', async () => {
            const user = await TestHelper.createUser(app);
            const invalidDto: Partial<typeof mockProjectdto> = { ...mockProjectdto, project_creator_id: user.body.user.id };
            delete invalidDto.project_name;

            const res = await TestHelper.createProject(app, invalidDto);
            expect(res.status).toBe(400);
            expect(res.body.message).toContain("project_name");
        });
    });

    describe("GET /project/:id", () => {
        it("should get a project by ID", async () => {
            const user = await TestHelper.createUser(app);
            const created = await TestHelper.createProject(app, { ...mockProjectdto, project_creator_id: user.body.user.id });
            const id = created.body.project.project_id;

            const res = await request(server).get(`/project/${id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("project");
            expect(res.body.project.project_id).toBe(id);
        });

        it("should return 404 for non-existing project", async () => {
            const res = await request(server).get(`/project/9999`);
            expect(res.status).toBe(404);
        });
    });

    describe("GET /project", () => {
        it("should get all projects", async () => {
            const res = await request(server).get('/project');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("projects");
            expect(Array.isArray(res.body.projects)).toBe(true);
        });
    });

    describe("PUT /project/:id", () => {
        it('should update a project by ID', async () => {
            const user = await TestHelper.createUser(app);
            const created = await TestHelper.createProject(app, { ...mockProjectdto, project_creator_id: user.body.user.id });
            const id = created.body.project.project_id;
            const mockData = { ...mockProjectdto, ...mockUpdateProjectDto, project_creator_id: user.body.user.id };

            const res = await request(server).put(`/project/${id}`).send(mockData);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("project");
            expect(res.body.project.project_id).toBe(id);
        });

        it("should return 404 for non-existing project", async () => {
            const user = await TestHelper.createUser(app);
            const mockData = { ...mockProjectdto, ...mockUpdateProjectDto, project_creator_id: user.body.user.id };

            const res = await request(server).put(`/project/9999`).send(mockData);
            expect(res.status).toBe(404);
        });

        it('should fail with invalid data (missing required field)', async () => {
            const user = await TestHelper.createUser(app);
            const created = await TestHelper.createProject(app, { ...mockProjectdto, project_creator_id: user.body.user.id });
            const id = created.body.project.project_id;

            const invalidDto: Partial<typeof mockProjectdto> = { ...mockProjectdto, project_creator_id: user.body.user.id };
            delete invalidDto.project_name;

            const res = await request(server).put(`/project/${id}`).send(invalidDto);
            expect(res.status).toBe(400);
            expect(res.body.message).toContain("project_name");
        });
    });

    describe("DELETE /project/:id", () => {
        it('should delete a project by ID', async () => {
            const user = await TestHelper.createUser(app);
            const created = await TestHelper.createProject(app, { ...mockProjectdto, project_creator_id: user.body.user.id });
            const id = created.body.project.project_id;

            const res = await request(server).delete(`/project/${id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message");
        });

        it("should return 404 for non-existing project", async () => {
            const res = await request(server).delete("/project/9999");
            expect(res.status).toBe(404);
        });
    });
});

