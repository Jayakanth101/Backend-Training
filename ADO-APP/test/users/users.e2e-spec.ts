import { INestApplication, ValidationPipe } from "@nestjs/common";
import { createTestApp } from "../setup";
import { UsersModule } from "../../src/users/users.module";
import * as request from "supertest";
import { mockCreateUserDto } from "../../src/mock-datas/dto/mock.crate-user.dto";
import { Repository } from "typeorm";
import { User } from "../../src/users/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TestHelper } from "../utils/test-helper";

describe("usersModule E2E", () => {

    let app: INestApplication;
    let server: any;
    let res: request.Response;
    let userRepository: Repository<User>;

    beforeAll(async () => {
        app = await createTestApp([UsersModule]);
        server = app.getHttpServer();

        userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    });

    afterAll(async () => {
        await app.close();
    });

    describe("POST/ /user", () => {

        it("should create a user successfully", async () => {
            const user = await TestHelper.createUser(app);
            expect(user.body).toHaveProperty("email");
            expect(user.body.displayname).toBe(user.body.displayname);
            expect(user.status).toBe(201);
        });

        it("Should fail if the user is already exists", async () => {
            const mockUser = mockCreateUserDto;
            mockUser.email = "jai@gmail.com";
            await TestHelper.createUser(app, mockUser);

            const user = await TestHelper.createUser(app, mockUser);
            expect(user.status).toBe(400);
        });

        it("should fail with invalid data (missing required field)", async () => {
            const invalidDto: Partial<typeof mockCreateUserDto> = { ...mockCreateUserDto };
            delete invalidDto.displayname;

            const res = await request(server).post("/user").send(invalidDto);
            expect(res.status).toBe(400);
            expect(res.body.message).toContain("displayname should not be empty");
        });

    });

    describe("GET/ /user", () => {
        it("should get all users as an array successfully", async () => {
            res = await request(server).get('/user');
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.status).toBe(200);
        });
    });

    describe("GET/ /user/:id", () => {
        it("should get an user by ID ", async () => {

            const createdUser = await TestHelper.createUser(app);
            const id = createdUser.body.id;

            res = await request(server).get(`/user/${id}`);
            expect(res.body.id).toBe(createdUser.body.id);
            expect(res.status).toBe(200);
        });

        it("should return 404 for non-existing user", async () => {
            res = await request(server).get(`/user/9999`);
            expect(res.status).toBe(404);
        });
    });

    describe("DELETE/ /user/id", () => {
        it("should delete an user by ID", async () => {
            res = await TestHelper.createUser(app);
            res = await TestHelper.deleteUser(app, res.body.id);
            console.log(res.body);
            expect(res.status).toBe(200);
        });

        it("should return 404 when deleting non-existing user", async () => {
            res = await request(server).delete(`/user/9999`);
            expect(res.status).toBe(404);
        });
    });
});
