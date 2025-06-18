import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkItem } from "./work-items.entity";
import { WorkItemsService } from "./work-items.service";
import { WorkItemsController } from "./work-items.controller";
import { Planning } from "src/planning/planning.entity";
import { Tags } from "src/tags/tag.entity";

@Module({
    imports: [TypeOrmModule.forFeature([WorkItem, Planning, Tags])],
    providers: [WorkItemsService],
    controllers: [WorkItemsController]
})
export class WorkItemsModule { }
