import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkItem } from "./work-items.entity";
import { WorkItemsService } from "./work-items.service";
import { WorkItemsController } from "./work-items.controller";
import { Planning } from "../planning/planning.entity";
import { Tags } from "../tags/tag.entity";
import { User } from "../../src/users/users.entity";
import { ProjectEntity } from "../../src/tables/project/project.entity";
import { ProjectMemberEntity } from "../../src/tables/project-member/project-member.entity";
import { Discussion } from "../../src/discussion/discussion.entity";
import { SprintEntity } from "../../src/tables/sprints/sprints.entity";
import { EpicEntity } from "../../src/tables/epic/epic.entity";
import { FeatureEntity } from "../../src/tables/feature/feature.entity";
import { UserStoryEntity } from "../../src/tables/user-story/user-story.entity";
import { Bug } from "../../src/tables/bug/bug.entity";
import { TaskEntity } from "../../src/tables/task/task.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WorkItem,
            Planning,
            Tags,
            User,
            ProjectEntity,
            ProjectMemberEntity,
            Discussion,
            SprintEntity,
            EpicEntity,
            FeatureEntity,
            UserStoryEntity,
            Bug,
            TaskEntity,
        ])
    ],
    providers: [WorkItemsService],
    controllers: [WorkItemsController],
    exports: [WorkItemsService],
})
export class WorkItemsModule { }
