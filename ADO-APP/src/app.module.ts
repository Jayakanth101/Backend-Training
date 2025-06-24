import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItem } from './work-items/work-items.entity';
import { WorkItemsModule } from './work-items/work-items.module';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { Planning } from './planning/planning.entity';
import { DiscussionModule } from './discussion/discussion.module';
import { Discussion } from './discussion/discussion.entity';
import { TagModule } from './tags/tag.module';

import { Tags } from './tags/tag.entity';
import { ProjectEntity } from './tables/project/project.entity';
import { ProjectMemberEntity } from './tables/project-member/project-member.entity';
import { EpicEntity } from './tables/epic/epic.entity';
import { FeatureEntity } from './tables/feature/feature.entity';
import { UserStoryEntity } from './tables/user-story/user-story.entity';
import { SprintEntity } from './tables/sprints/sprints.entity';
import { SprintsModule } from './tables/sprints/sprints.module';
import { ProjectModule } from './tables/project/project.module';

const entity_arr = [WorkItem, User, Planning, Discussion, Tags, ProjectEntity, ProjectMemberEntity, EpicEntity, FeatureEntity, UserStoryEntity, SprintEntity];

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'devuser',
            password: 'root',
            database: 'ado_app',
            entities: entity_arr,
            synchronize: true,
            logging: true,
            logger: 'advanced-console'
        }), WorkItemsModule, UsersModule, DiscussionModule, TagModule, SprintsModule, ProjectModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
