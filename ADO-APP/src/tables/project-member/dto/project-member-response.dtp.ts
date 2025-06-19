import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProjectMemberResponseDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsString()
    user_name: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}
