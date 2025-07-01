import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { createTestApp } from "../setup";
import { ProjectModule } from "../../src/tables/project/project.module";
import { mockProject, mockProjectdto } from "../../src/mock-datas";
import { Repository } from "typeorm";
import { ProjectEntity } from "../../src/tables/project/project.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mockUpdateProjectDto } from "../../src/mock-datas/dto/mock.update-project.dto";
import { TestHelper } from "../../test/utils/test-helper";

describe("ProjectModule E2E", () => {
    let app: INestApplication;
    let server: any;
    let projectRepo: Repository<ProjectEntity>

    beforeAll(async () => {
        app = await createTestApp([ProjectModule]);
        server = app.getHttpServer();
        projectRepo = app.get<Repository<ProjectEntity>>(getRepositoryToken(ProjectEntity));
    });

    describe("POST/ /project", () => {
        it('should create a project successfully', async () => {
            const res = await TestHelper.createProject(app, mockProjectdto);

            expect(res.body).toHaveProperty("project_id");
            expect(res.status).toBe(201);
        });
        it('should fail with invalid data (missing required field)', async () => {
            const invalidDto: Partial<typeof mockProjectdto> = { ...mockProjectdto };
            delete invalidDto.project_name;

            const res = await TestHelper.createProject(app, invalidDto);

            expect(res.status).toBe(400);
            expect(res.body.message).toContain("project_name must be a string");
        });
    });

    describe("GET/ /project/:id", () => {
        it("should get a project by ID", async () => {

            const createdProject = await TestHelper.createProject(app, mockProjectdto);
            const id = createdProject.body.project_id;

            const res = await request(server).get(`/project/${id}`);
            expect(res.body).toHaveProperty("project_id");
            expect(res.status).toBe(200);
            expect(res.body.project_id).toBe(id);
        });

        it("should return 404 for non-existing project", async () => {
            const res = await request(server).get(`/project/9999`);
            expect(res.status).toBe(404);
        });
    });

    describe("GET/ /project/", () => {
        it("should get all projects", async () => {
            const res = await request(server).get('/project');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe("/PUT /project/:id/", () => {
        it('should update a project details by ID', async () => {
            const created_project = await TestHelper.createProject(app, mockProjectdto);
            const projectId = created_project.body.project_id;

            const res = await request(server).put(`/project/${projectId}`).send(mockUpdateProjectDto);
            expect(res.status).toBe(200);
        });

        it("should return 404 for non-existing project", async () => {
            const res = await request(server).get(`/project/9999`);
            expect(res.status).toBe(404);
        });

        it('should fail with invalid data (missing required field)', async () => {
            const invalidDto: Partial<typeof mockProjectdto> = { ...mockProjectdto };
            delete invalidDto.project_name;

            const res = await request(server).post(`/project/`).send(invalidDto);
            expect(res.status).toBe(400);
            expect(res.body.message).toContain("project_name should not be empty");
        });

    });

    describe("/DELETE /project/:id", () => {
        it('should delete a project by ID', async () => {
            const created_project = await TestHelper.createProject(app, mockProjectdto);

            const projectId: number = created_project.body.project_id;
            const res = await request(server).delete(`/project/${projectId}`);
            expect(res.status).toBe(200);
        });

        it("should return 404 for non-existing project", async () => {
            const res = await request(server).delete("/project/9999");
            expect(res.status).toBe(404);
        });
    });

});
