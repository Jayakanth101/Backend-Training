import { WorkItem } from "../../src/work-items/work-items.entity";
import { Repository } from "typeorm";
import { createTestApp } from "../setup";
import { INestApplication } from "@nestjs/common";
import { WorkItemsModule } from "../../src/work-items/work-items.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TestHelper } from "../utils/test-helper";
import { mockWorkItemDto, mockWorkItemDto as mockWorkitemFilterDto } from "../../src/mock-datas";
import { ProjectModule } from "../../src/tables/project/project.module";
import { UsersModule } from "../../src/users/users.module";
import { SprintsModule } from "../../src/tables/sprints/sprints.module";
import * as request from "supertest";
import { ProjectMemberModule } from "../../src/tables/project-member/project-member.module";
describe("workItemModule E2E", () => {

    let app: INestApplication;
    let server: any;
    let workitemRepo: Repository<WorkItem>;


    beforeAll(async () => {
        app = await createTestApp([WorkItemsModule, ProjectModule, UsersModule, ProjectMemberModule, SprintsModule]);
        server = app.getHttpServer();
        workitemRepo = app.get<Repository<WorkItem>>(getRepositoryToken(WorkItem));
    });

    afterAll(async () => {
        await app.close();
    });

    describe("POST/ /workitems/", () => {
        it("should create a workitem successfully", async () => {
            const res = await TestHelper.createWorkitem(app, mockWorkItemDto);
            expect(res.status).toBe(201);
        });
    });

    describe("GET/ /workitems", () => {


        it("should get all workitems", async () => {
            const workItem = await TestHelper.createWorkitem(app, mockWorkitemFilterDto);
            const res = await request(server).get('/workitems');
            expect(res.status).toBe(200);
        });
        it("should return a workitems based on type", async () => {
            const workItem = await TestHelper.createWorkitem(app, mockWorkitemFilterDto);
            const res = await request(server).get("/workitems").query({ type: "Epic" });
            expect(res.status).toBe(200);
            expect(res.body[0].type).toBe("Epic");
        });
        it("should return a workitem by state", async () => {
            const workItem = await TestHelper.createWorkitem(app, mockWorkitemFilterDto);
            const res = await request(server).get("/workitems").query({ state: "New" });
            console.log("---> ", res.body[0]);
            expect(res.status).toBe(200);
            expect(res.body[0].state).toBe("New");
        });
        it("should return a workitem by assignee", async () => {
            const workItem = await TestHelper.createWorkitem(app, mockWorkitemFilterDto);
            const res = await request(server).get("/workitems").query({ assigned_to: mockWorkitemFilterDto.assigned_to });
            // console.log("---> ", res.body[0]);
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]?.assignedTo?.id).toBe(mockWorkitemFilterDto.assigned_to);
        });
        it("should return a workitem by keyword", async () => {
            const workItem = await TestHelper.createWorkitem(app, mockWorkitemFilterDto);
            const res = await request(server).get("/workitems").query({ keyword: "Epic" });
            expect(res.status).toBe(200);
            expect(res.body[0].title.toLowerCase()).toContain("first workitem");
        });
    });


})
