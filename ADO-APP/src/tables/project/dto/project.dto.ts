import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Type } from "class-transformer";
import { ProjectMemberDto } from "src/tables/project-member/dto/project-member.dto";

export class ProjectEntityDto {
    @IsString()
    project_name: string;

    @IsOptional()
    @IsString()
    project_description: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    project_creator_id: number;


    @IsOptional()
    @Type(() => ProjectMemberDto)
    members: ProjectMemberDto[];
}
