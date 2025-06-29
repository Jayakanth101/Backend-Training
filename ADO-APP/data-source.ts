// data-source.ts
import { WorkItem } from './src/work-items/work-items.entity';
import { User } from './src/users/users.entity';
import { Planning } from './src/planning/planning.entity';
import { Discussion } from './src/discussion/discussion.entity';

import { Tags } from './src/tags/tag.entity';
import { ProjectEntity } from './src/tables/project/project.entity';
import { ProjectMemberEntity } from './src/tables/project-member/project-member.entity';
import { EpicEntity } from './src/tables/epic/epic.entity';
import { FeatureEntity } from './src/tables/feature/feature.entity';
import { UserStoryEntity } from './src/tables/user-story/user-story.entity';
import { SprintEntity } from './src/tables/sprints/sprints.entity';

const entity_arr = [WorkItem, User, Planning, Discussion, Tags, ProjectEntity, ProjectMemberEntity, EpicEntity, FeatureEntity, UserStoryEntity, SprintEntity];

import { DataSource } from 'typeorm';
// Add other entities as needed
import * as dotenv from 'dotenv';

dotenv.config(); // To use .env values

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'devuser',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'ado_app',
    entities: entity_arr,
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
});

