import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkItem } from "../src/work-items/work-items.entity";
import { User } from "../src/users/users.entity";
import { Planning } from "../src/planning/planning.entity";
import { Discussion } from "../src/discussion/discussion.entity";
import { Tags } from "../src/tags/tag.entity";
import { ProjectEntity } from "../src/tables/project/project.entity";
import { ProjectMemberEntity } from "../src/tables/project-member/project-member.entity";
import { EpicEntity } from "../src/tables/epic/epic.entity";
import { FeatureEntity } from "../src/tables/feature/feature.entity";
import { UserStoryEntity } from "../src/tables/user-story/user-story.entity";
import { SprintEntity } from "../src/tables/sprints/sprints.entity";



export async function createTestApp(modules: any[]): Promise<INestApplication> {
    const entity_arr = [WorkItem, User, Planning, Discussion, Tags, ProjectEntity, ProjectMemberEntity, EpicEntity, FeatureEntity, UserStoryEntity, SprintEntity];

    const module: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "devuser",
                password: "password",
                database: "ado_app",
                entities: entity_arr,
                synchronize: true,
            }),
            ...modules
        ],
    }).compile();

    const app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
    await app.init();
    return app;
}
