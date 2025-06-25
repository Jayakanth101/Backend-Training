import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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

