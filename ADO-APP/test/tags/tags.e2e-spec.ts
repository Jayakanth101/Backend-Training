import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../setup';
import * as request from 'supertest';
import { TagModule } from '../../src/tags/tag.module';
import { UsersModule } from '../../src/users/users.module';
import { ProjectModule } from '../../src/tables/project/project.module';
import { WorkItemsModule } from '../../src/work-items/work-items.module';
import { ProjectMemberModule } from '../../src/tables/project-member/project-member.module';
import { mockProjectdto } from '../../src/mock-datas';
import { TestHelper } from '../utils/test-helper';
import { clearDatabase } from '../../test/utils/database-helper';
import { DataSource } from 'typeorm';

describe('TagModule - E2E', () => {
    let app: INestApplication;
    let workItemId: number;
    let tagId: number;
    let creatorId: number;
    let dataSource: DataSource;

    beforeAll(async () => {
        app = await createTestApp([
            TagModule,
            ProjectModule,
            UsersModule,
            WorkItemsModule,
            ProjectMemberModule,
        ]);
        await app.init();
        dataSource = await app.get(DataSource);

        await clearDatabase(dataSource);

        // Create a user, project, member and work item
        const createdUser = await TestHelper.createUser(app);
        creatorId = createdUser.body.user.id;

        const createdProject = await TestHelper.createProject(app, {
            ...mockProjectdto,
            project_creator_id: creatorId,
        });

        const createdMember = await TestHelper.createProjectMember(
            app,
            creatorId,
            createdProject.body.project.project_id
        );

        const createdWorkItem = await TestHelper.createWorkitem(app, {
            created_by: creatorId,
            assigned_to: createdMember.body.project_member.id,
        });

        workItemId = createdWorkItem.body.Work_item.id;
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /tag - should create a tag', async () => {
        const res = await request(app.getHttpServer())
            .post('/tag')
            .send({ tagname: 'urgent' });

        expect(res.status).toBe(201);
        expect(res.body.Tags).toHaveProperty('id');
        expect(res.body.Tags.tagname).toBe('urgent');
        tagId = res.body.Tags.id;
    });

    it('PUT /tag/:id - should tag workitem to tag', async () => {
        const res = await request(app.getHttpServer())
            .put(`/tag/${tagId}`)
            .send({ workitem_ids: [workItemId] });

        expect(res.status).toBe(200);
        expect(res.body.Tag).toHaveProperty('id', tagId);
        expect(res.body.Tag.workitems.some(w => w.id === workItemId)).toBe(true);
    });

    it('GET /tag/:workitemId - should fetch tags for workitem', async () => {
        const res = await request(app.getHttpServer())
            .get(`/tag/${workItemId}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.Tags)).toBe(true);
        expect(res.body.Tags.length).toBeGreaterThan(0);
        expect(res.body.Tags.some(t => t.id === tagId)).toBe(true);
    });

    it('DELETE /tag/:tagId/workitem/:workItemId - should remove tag from workitem', async () => {
        const res = await request(app.getHttpServer())
            .delete(`/tag/${tagId}/workitem/${workItemId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/removed/);
    });

    it('GET /tag/:workitemId - should return empty after removal', async () => {
        const res = await request(app.getHttpServer())
            .get(`/tag/${workItemId}`);

        expect(res.status).toBe(200);
        expect(res.body.Tags.length).toBe(0);
    });
});

