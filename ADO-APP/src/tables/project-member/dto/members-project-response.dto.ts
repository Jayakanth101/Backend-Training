
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MembersProjectResponseDto {
    @IsNumber()
    @IsNotEmpty()
    project_id: number;

    @IsString()
    @IsNotEmpty()
    project_name: string;
}
