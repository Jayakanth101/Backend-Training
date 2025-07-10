
import { IsOptional, IsNumber, IsArray } from "class-validator";

export class UpdateTagDto {

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    workitem_ids?: number[];

}

