import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DataSource } from "typeorm";
import { createTestApp } from "../setup";
import { UsersModule } from "../../src/users/users.module";
import * as request from "supertest";
import { mockCreateUserDto } from "../../src/mock-datas/dto/mock.crate-user.dto";
import { Repository } from "typeorm";
import { User } from "../../src/users/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TestHelper } from "../utils/test-helper";
import { clearDatabase } from "../../test/utils/database-helper";

describe("usersModule E2E", () => {
    let app: INestApplication;
    let server: any;
    let res: request.Response;
    let userRepository: Repository<User>;
    let dataSource: DataSource;

    beforeAll(async () => {
        app = await createTestApp([UsersModule]);
        server = app.getHttpServer();
        userRepository = app.get<Repository<User>>(getRepositoryToken(User));
        dataSource = app.get(DataSource);
    });

    afterAll(async () => {
        await app.close();
    });
    beforeEach(async () => {
        await clearDatabase(dataSource);
    });


    describe("POST/ /user", () => {
        it("should create a user successfully", async () => {
            const user = await TestHelper.createUser(app);
            expect(user.status).toBe(201);
            expect(user.body).toHaveProperty("user");
            expect(user.body.user).toHaveProperty("email");
            expect(user.body.user.displayname).toBeDefined();
        });

        it("should fail if the user already exists", async () => {
            const mockUser = mockCreateUserDto;
            mockUser.email = "jai@gmail.com";

            await TestHelper.createUser(app, mockUser);
            const user = await TestHelper.createUser(app, mockUser);

            expect(user.status).toBe(400);
            expect(user.body.message).toBe("Display name already exists");
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
        it("should return all users wrapped in 'users' array", async () => {
            res = await request(server).get('/user');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("users");
            expect(Array.isArray(res.body.users)).toBe(true);
        });
    });

    describe("GET/ /user/:id", () => {
        it("should get a user by ID", async () => {
            const createdUser = await TestHelper.createUser(app);
            const id = createdUser.body.user.id;

            res = await request(server).get(`/user/${id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("user");
            expect(res.body.user.id).toBe(id);
        });

        it("should return 404 for non-existing user", async () => {
            res = await request(server).get(`/user/9999`);
            expect(res.status).toBe(404);
        });
    });

    describe("DELETE/ /user/:id", () => {
        it("should delete a user by ID", async () => {
            const createdUser = await TestHelper.createUser(app);
            const userId = createdUser.body.user.id;

            res = await TestHelper.deleteUser(app, userId);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message");
        });

        it("should return 404 when deleting non-existing user", async () => {
            res = await request(server).delete(`/user/9999`);
            expect(res.status).toBe(404);
        });
    });
});

