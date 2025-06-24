import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkItem } from "src/work-items/work-items.entity";
import { ProjectEntity } from "../project/project.entity";
import { SprintService } from "./sprints.service";
import { SprintsController } from "./sprints.controller";
import { SprintEntity } from "./sprints.entity";

@Module({
    imports: [TypeOrmModule.forFeature([SprintEntity, WorkItem, ProjectEntity])],
    providers: [SprintService],
    controllers: [SprintsController]
})

export class SprintsModule { }

