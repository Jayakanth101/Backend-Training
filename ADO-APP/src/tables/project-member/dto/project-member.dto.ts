import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ProjectEntityDto } from "src/tables/project/dto/project.dto";

export class ProjectMemberDto {

    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    // @IsNotEmpty()
    // project: ProjectEntityDto;

    @IsNotEmpty()
    @IsString()
    role: string;

}

