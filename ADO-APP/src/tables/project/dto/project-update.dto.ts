import { PartialType } from "@nestjs/mapped-types";
import { ProjectEntityDto } from "./project.dto";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ProjectMemberDto } from "../../../tables/project-member/dto/project-member.dto";

export class ProjectUpdateDto {

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProjectMemberDto)
    members?: ProjectMemberDto[];

    @IsOptional()
    @IsString()
    project_name?: string;;

    @IsOptional()
    @IsString()
    project_description?: string;

}
