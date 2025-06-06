import { IsDate, IsEnum, IsInt, IsNotEmpty } from "class-validator"
import { Risk } from "src/work-items/enum/work-items-enum";

import { Type as Transform } from "class-transformer";
export class CreatePlanningDto {

    @IsNotEmpty()
    @IsInt()
    workitemid: number;

    @IsNotEmpty()
    @IsInt()
    priority: number;

    @IsNotEmpty()
    @IsEnum(Risk)
    risk: Risk;

    @IsNotEmpty()
    @IsInt()
    effort: number;

    @IsNotEmpty()
    @IsInt()
    businessvalue: number;

    @IsNotEmpty()
    @IsInt()
    timecriticality: number;

    @IsNotEmpty()
    @Transform(() => Date)
    @IsDate()
    startdate: Date;

    @IsNotEmpty()
    @Transform(() => Date)
    @IsDate()
    targetdate: Date;

}
