import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../users/users.entity";
import { WorkItem } from "../../work-items/work-items.entity";
import { SprintEntity } from "../sprints/sprints.entity";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { ProjectEntity } from "./project.entity";

@Module({
    imports: [TypeOrmModule.forFeature([WorkItem, User, SprintEntity, ProjectEntity])],
    controllers: [ProjectController],
    providers: [ProjectService]
})

export class ProjectModule { }
