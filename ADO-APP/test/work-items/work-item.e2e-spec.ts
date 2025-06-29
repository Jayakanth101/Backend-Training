import { WorkItem } from "../../src/work-items/work-items.entity";
import * as request from "supertest"
import { Repository } from "typeorm";
import { createTestApp } from "../setup";
import { INestApplication } from "@nestjs/common";
import { WorkItemsModule } from "../../src/work-items/work-items.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TestHelper } from "../utils/test-helper";
import { mockWorkItemDto } from "../../src/mock-datas";

describe("workItemModule E2E", () => {

    let app: INestApplication;
    let server: any;
    let workitemRepo: Repository<WorkItem>;

    beforeAll(async () => {
        app = await createTestApp([WorkItemsModule]);
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
            console.log("Hello res bod: ", res.body);
        });
    });

    describe("GET/ /workitems", () => {

        it("should get all workitems", async () => {
            const res = await request(server).get('/workitems');
            expect(res.status).toBe(200);
        });
        it("should return a workitems based on type", async () => {
            const res = await request(server).get("/workitems").query({ type: "Epic" });
            expect(res.status).toBe(200);
            expect(res.body[0].type).toBe("Epic");
        });
        it("should return a workitem by state", async () => {
            const res = await request(server).get("/workitems").query({ state: "New" });
            expect(res.status).toBe(200);
            expect(res.body[0].state).toBe("New");
        });
        it("should return a workitem by assignee", async () => {
            const res = await request(server).get("/workitems").query({ assigned_to: mockWorkItemDto.assigned_to });
            console.log(res.body[0]);
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]?.assignedTo?.id).toBe(mockWorkItemDto.assigned_to);
        });
        it("should return a workitem by keyword", async () => {
            const res = await request(server).get("/workitems").query({ keyword: "Epic" });
            expect(res.status).toBe(200);
            expect(res.body[0].title.toLowerCase()).toContain("first workitem");
        });
    });


})
