
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProjectMemberRoleDto {
    @IsNotEmpty()
    @IsString()
    role: string;
}
