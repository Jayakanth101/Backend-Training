import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { WorkItem } from '../../src/work-items/work-items.entity';
import { Tags } from '../../src/tags/tag.entity';
import { TestHelper } from '../utils/test-helper';
import { mockProjectdto, mockWorkItemDto } from '../../src/mock-datas';
import { DataSource } from 'typeorm';
import { clearDatabase } from '../../test/utils/database-helper';

describe('WorkItemsController (e2e) - All Filters', () => {
    let app: INestApplication;
    let workItem: any;
    let projectMemberId: number;
    let dataSource: DataSource;

    const endpoint = '/workitems';

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        dataSource = app.get(DataSource);
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await clearDatabase(dataSource);
    });


    beforeEach(async () => {
        // 1. Create a user
        const user = await TestHelper.createUser(app);
        const userId = user.body.user.id;

        // 2. Create a project
        const project = await TestHelper.createProject(app, mockProjectdto);
        const projectId = project.body.project.project_id;

        // 3. Add user to project
        const member = await TestHelper.addUserToProject(app, {
            user_id: userId,
            project_id: projectId
        });
        projectMemberId = member.body.project_member.id;

        // 4. Create work item
        const workItemRes = await TestHelper.createWorkitem(app, {
            project_id: projectId,
            created_by: userId,
            assigned_to: projectMemberId,
        });

        workItem = workItemRes.body.Work_item;
    });

    it('should filter by assigned_to', async () => {
        const res = await request(app.getHttpServer())
            .get(endpoint)
            .query({ assigned_to: projectMemberId })
            .expect(200);

        expect(res.body.Work_item.some((w) => w.id === workItem.id)).toBeTruthy();
    });

    it('should filter by state', async () => {
        const res = await request(app.getHttpServer())
            .get(endpoint)
            .query({ state: workItem.state }) // e.g. 'New'
            .expect(200);

        expect(res.body.Work_item.some(w => w.id === workItem.id)).toBeTruthy();
    });

    it('should filter by area_path', async () => {
        const res = await request(app.getHttpServer())
            .get(endpoint)
            .query({ area_path: workItem.area_path })
            .expect(200);

        expect(res.body.Work_item.some(w => w.id === workItem.id)).toBeTruthy();
    });

    it('should filter by recently_created', async () => {
        const res = await request(app.getHttpServer())
            .get(endpoint)
            .query({ recently_created: true })
            .expect(200);

        expect(res.body.Work_item.some(w => w.id === workItem.id)).toBeTruthy();
    });

    it('should filter by recently_updated', async () => {
        const res = await request(app.getHttpServer())
            .get(endpoint)
            .query({ recently_updated: true })
            .expect(200);

        expect(res.body.Work_item.some(w => w.id === workItem.id)).toBeTruthy();
    });

    it('should filter by recently_completed', async () => {
        const res = await request(app.getHttpServer())
            .get(endpoint)
            .query({ recently_completed: true })
            .expect(200);

        expect(res.body.Work_item.some(w => w.id === workItem.id)).toBeTruthy();
    });

    it('should filter by keyword (title/description)', async () => {
        const res = await request(app.getHttpServer())
            .get(endpoint)
            .query({ keyword: workItem.title }) // or workItem.description
            .expect(200);

        expect(res.body.Work_item.some(w => w.id === workItem.id)).toBeTruthy();
    });

    // Tags test — assuming `workItem.tags = [{ tagname: 'urgent' }]`
    it('should filter by tags', async () => {
        const res = await request(app.getHttpServer())
            .get(endpoint)
            .query({ 'tags[0].tagname': 'urgent' }) // serialize like this
            .expect(200);

        expect(res.body.Work_item.some(w => w.id === workItem.id)).toBeTruthy();
    });
});

