import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateSprintDto {
    @IsOptional()
    @IsString()
    sprint_name?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsDate()
    start_date?: Date;

    @IsOptional()
    @IsDate()
    end_date?: Date;

}
