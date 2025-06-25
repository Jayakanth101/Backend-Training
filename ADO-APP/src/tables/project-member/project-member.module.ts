import { Module } from "@nestjs/common";
import { ProjectMemberController } from "./project-member.controller";
import { ProjectMemberService } from "./project-member.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectMemberEntity } from "./project-member.entity";
import { WorkItem } from "src/work-items/work-items.entity";
import { User } from "src/users/users.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectMemberEntity, WorkItem, User])
    ],
    controllers: [ProjectMemberController],
    providers: [ProjectMemberService],
    exports: [ProjectMemberService]
})
export class ProjectMemberModule { }
