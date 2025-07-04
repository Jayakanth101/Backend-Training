// import { INestApplication } from "@nestjs/common";
// import { createTestApp } from "../setup";
// import { DiscussionModule } from "../../src/discussion/discussion.module";
// import * as request from 'supertest'
// import { mockCreateDiscussionDto } from "../../src/mock-datas";
// import { TestHelper } from "../utils/test-helper";
// import { CreateDiscussionDto } from "../../src/discussion/dto/create-discussion.dto";
// import { UsersModule } from "../../src/users/users.module";
// import { WorkItemsModule } from "../../src/work-items/work-items.module";
// import { User } from "src/users/users.entity";
//
// console.log('E2E Test: discussion.e2e-spec.ts running...');
// describe('discussionModule()', () => {
//
//     let app: INestApplication;
//     let workItemId: number;
//
//     beforeAll(async () => {
//         app = await createTestApp([DiscussionModule, UsersModule, WorkItemsModule]);
//     });
//
//     afterAll(async () => {
//         await app.close();
//     });
//
//     it("POST/ /discussion", async () => {
//         const createdUser = await TestHelper.createUser(app);
//         const createdWorkItem = await TestHelper.createWorkitem(app);
//         console.log("user id: ", createdUser.body.id);
//         console.log("work item id: ", createdUser.body.id);
//         workItemId = createdUser.body.id;
//
//         const mockDiscussion: CreateDiscussionDto = { ...mockCreateDiscussionDto, workitemid: createdWorkItem.body.id, creatorid: createdUser.body.id }
//
//         const res = await request(app.getHttpServer())
//             .post('/discussion')
//             .send(mockDiscussion);
//         console.log("The discussion create res body: ", res.body);
//         expect(res.status).toBe(201);
//     });
//
//     // it("GET/ /discussion", async () => {
//     //     const res = await request(app.getHttpServer())
//     //         .get(`/discussion/workitem/${workItemId}`);
//     //     console.log("The get discussion: ", res.body);
//     //     expect(res.status).toEqual(200);
//     // });
// });
