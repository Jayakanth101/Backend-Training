import { IsNotEmpty, IsNumber } from "class-validator";
import { ProjectEntityDto } from "src/tables/project/dto/project.dto";

export class ProjectMemberDto {

    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    project: ProjectEntityDto;

}

