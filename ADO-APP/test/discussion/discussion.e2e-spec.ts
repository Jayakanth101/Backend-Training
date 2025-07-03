import { INestApplication } from "@nestjs/common";
import { createTestApp } from "../setup";
import { DiscussionModule } from "../../src/discussion/discussion.module";
import { UsersModule } from "../../src/users/users.module";
import { WorkItemsModule } from "../../src/work-items/work-items.module";
import { TestHelper } from "../utils/test-helper";
import * as request from 'supertest';
import { CreateDiscussionDto } from "../../src/discussion/dto/create-discussion.dto";
import { UpdateDiscussionDto } from "../../src/discussion/dto/update-dicussion.dto";
import { ProjectModule } from "../../src/tables/project/project.module";
import { ProjectMemberModule } from "../../src/tables/project-member/project-member.module";
import { mockProjectdto } from "../../src/mock-datas";

describe('DiscussionModule - E2E', () => {
    let app: INestApplication;
    let workItemId: number;
    let creatorId: number;
    let commentId: number;
    let commentid: number;

    beforeAll(async () => {
        app = await createTestApp([
            DiscussionModule,
            ProjectModule,
            UsersModule,
            WorkItemsModule,
            ProjectMemberModule
        ]);

        const createdUser = await TestHelper.createUser(app);

        const createdProject = await TestHelper.createProject(app, {
            ...mockProjectdto,
            project_creator_id: createdUser.body.user.id
        });

        const memberRes = await TestHelper.createProjectMember(
            app,
            createdUser.body.user.id,
            createdProject.body.project.project_id
        );

        const workItemRes = await TestHelper.createWorkitem(app, {
            created_by: createdUser.body.user.id,
            assigned_to: memberRes.body.project_member.id
        });

        creatorId = createdUser.body.user.id;
        workItemId = workItemRes.body.Work_item.id;
        commentid = Math.floor(Math.random() * 1000000);
    });

    afterAll(async () => {
        await app.close();
    });

    it("POST /discussion - should create a comment", async () => {
        const dto: CreateDiscussionDto = {
            commentid,
            workitemid: workItemId,
            creatorid: creatorId,
            message: 'Initial discussion content',
            createdat: new Date()
        };

        const res = await request(app.getHttpServer())
            .post('/discussion')
            .send(dto);

        expect(res.status).toBe(201);
        expect(res.body.Discussion).toHaveProperty("commentid");
        commentId = res.body.Discussion.commentid;
    });

    it("GET /discussion/workitem/:id - should fetch discussions for a work item", async () => {
        const res = await request(app.getHttpServer())
            .get(`/discussion/workitem/${workItemId}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.Discussion)).toBe(true);
        expect(res.body.Discussion.length).toBeGreaterThanOrEqual(1);
    });

    it("PUT /discussion/workitem/:workitemid/comment/:commentid - should update comment message", async () => {
        console.log(commentid);
        console.log(workItemId);

        const updatedContent = "Updated discussion content";

        const updateDto: UpdateDiscussionDto = {
            message: updatedContent,
            createdat: new Date()
        };

        const res = await request(app.getHttpServer())
            .put(`/discussion/workitem/${workItemId}/comment/${commentid}`)
            .send(updateDto);

        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body.Discussion.message).toBe(updatedContent);
    });

    it("POST /discussion - should fail for invalid user ID", async () => {
        const dto: CreateDiscussionDto = {
            workitemid: workItemId,
            creatorid: 9999,
            commentid: Date.now(),
            message: 'Invalid user test',
            createdat: new Date()
        };

        const res = await request(app.getHttpServer())
            .post('/discussion')
            .send(dto);

        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/User with id 9999 not found/);
    });

    it("PUT /discussion/workitem/:id/comment/:id - should return 404 if comment not found", async () => {
        const updateDto: UpdateDiscussionDto = {
            message: 'x',
            createdat: new Date()
        };

        const res = await request(app.getHttpServer())
            .put(`/discussion/workitem/${workItemId}/comment/9999`)
            .send(updateDto);

        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/Comment 9999 not found/);
    });
});

