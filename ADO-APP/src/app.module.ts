import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItem } from './work-items/work-items.entity';
import { WorkItemsModule } from './work-items/work-items.module';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { Planning } from './planning/planning.entity';
import { PlanningModule } from './planning/planning.module';
import { DiscussionModule } from './discussion/discussion.module';
import { Discussion } from './discussion/discussion.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'devuser',
            password: 'root',
            database: 'ado_app',
            entities: [WorkItem, User, Planning, Discussion],
            synchronize: false,
        }), WorkItemsModule, UsersModule, PlanningModule, DiscussionModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
