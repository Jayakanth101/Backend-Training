import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateSprintDto {
    @IsOptional()
    @IsString()
    sprint_name: string;

    @IsOptional()
    @IsString()
    location: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    start_date: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    end_date: Date;

}
