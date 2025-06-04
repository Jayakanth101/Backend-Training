import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkItems } from "./WorkItems.entity";
import { WorkItemsService } from "./WorkItems.service";
import { WorkItemsController } from "./WorkItems.controller";

@Module({
    imports: [TypeOrmModule.forFeature([WorkItems])],
    providers: [WorkItemsService],
    controllers: [WorkItemsController]
})
export class WorkItemsModule { }
