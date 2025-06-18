import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator"
import { Risk } from "src/work-items/enum/work-items-enum";
import { Type as Transform } from "class-transformer";

export class CreatePlanningDto {

    @IsNotEmpty()
    @IsInt()
    priority: number;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Risk)
    risk: Risk;

    @IsOptional()
    @IsInt()
    effort: number;

    @IsOptional()
    @IsInt()
    storypoint: number;

    @IsOptional()
    @IsInt()
    businessvalue: number;

    @IsOptional()
    @IsInt()
    timecriticality: number;

    @IsOptional()
    @Transform(() => Date)
    @IsDate()
    startdate: Date;

    @IsOptional()
    @Transform(() => Date)
    @IsDate()
    targetdate: Date;

}
