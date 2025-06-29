import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Type } from "class-transformer";
import { ProjectMemberDto } from "../../../tables/project-member/dto/project-member.dto";

export class ProjectEntityDto {

    @IsNotEmpty()
    @IsString()
    project_name: string;

    @IsOptional()
    @IsString()
    project_description?: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    project_creator_id: number;


    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProjectMemberDto)
    members?: ProjectMemberDto[];
}
