import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Discussion } from "./discussion.entity";
import { WorkItem } from "../work-items/work-items.entity";
import { User } from "../users/users.entity";
import { DiscussionController } from "./discussion.controller";
import { DiscussionService } from "./discussion.service";

@Module({
    imports: [TypeOrmModule.forFeature([Discussion, WorkItem, User])],
    controllers: [DiscussionController],
    providers: [DiscussionService],
    exports: [TypeOrmModule],

})

export class DiscussionModule {

}
