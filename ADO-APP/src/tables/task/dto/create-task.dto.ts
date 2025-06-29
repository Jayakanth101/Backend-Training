import { CreateWorkItemDto } from "../../../../src/work-items/dto/create-work-item-dto";
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto extends CreateWorkItemDto {
    @IsOptional()
    @IsNumber()
    original_estimates?: number;

    @IsOptional()
    @IsNumber()
    remianing?: number;

    @IsOptional()
    @IsNumber()
    completed?: number;

    @IsOptional()
    @IsString()
    implementation?: string;

}
