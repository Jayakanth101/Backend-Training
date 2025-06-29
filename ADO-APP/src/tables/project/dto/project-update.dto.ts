import { PartialType } from "@nestjs/mapped-types";
import { ProjectEntityDto } from "./project.dto";
import { IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ProjectMemberDto } from "../../../tables/project-member/dto/project-member.dto";

export class ProjectUpdateDto extends PartialType(ProjectEntityDto) {

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProjectMemberDto)
    members?: ProjectMemberDto[];

}
