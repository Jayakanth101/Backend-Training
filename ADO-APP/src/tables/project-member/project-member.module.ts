import { Module } from "@nestjs/common";
import { ProjectMemberController } from "./project-member.controller";
import { ProjectMemberService } from "./project-member.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectMemberEntity } from "./project-member.entity";
import { WorkItem } from "../../work-items/work-items.entity";
import { User } from "../../users/users.entity";
import { ProjectEntity } from "../project/project.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectMemberEntity, WorkItem, User, ProjectEntity])
    ],
    controllers: [ProjectMemberController],
    providers: [ProjectMemberService],
    exports: [ProjectMemberService]
})
export class ProjectMemberModule { }
