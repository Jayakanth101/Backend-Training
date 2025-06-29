import { INestApplication } from "@nestjs/common";
import { CreateUserDto } from "../../src/users/dto/users.dto";
import { mockCreateUserDto } from "../../src/mock-datas/dto/mock.crate-user.dto";
import * as request from "supertest";
import { mockProject, mockProjectdto, mockWorkitem, mockWorkItemDto } from "../../src/mock-datas";
import { ProjectEntityDto } from "../../src/tables/project/dto/project.dto";
import { CreateWorkItemDto } from "../../src/work-items/dto/create-work-item-dto";
import { send } from "process";
import { WorkItem } from "src/work-items/work-items.entity";

export class TestHelper {

    static async createUser(app: INestApplication, overrides: Partial<CreateUserDto> = {}) {
        const timestamp = Date.now();
        const uniqueDto: CreateUserDto = {
            displayname: `User_${timestamp}`,
            email: `user_${timestamp}@test.com`,
            password: 'password',
            ...overrides
        };
        const dto = { ...mockCreateUserDto, ...overrides };
        const res = await request(app.getHttpServer()).post('/user')
            .send(uniqueDto);
        return res;
    }

    static async deleteUser(app: INestApplication, Id: number) {
        return await request(app.getHttpServer()).delete(`/user/${Id}`);
    }


    static async createProject(app: INestApplication, overrides: Partial<ProjectEntityDto> = {}) {
        const dto = overrides;
        let server = app.getHttpServer();
        return await request(server).post("/project").send(dto);
    }

    static async createWorkitem(app: INestApplication, overrides: Partial<CreateWorkItemDto> = {}) {
        const dto = { ...mockWorkItemDto, ...overrides };
        let server = app.getHttpServer();
        return await request(server).post("/workitems").send(dto);
    }

}
