import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class SprintDto {

    @IsOptional()
    @IsString()
    sprint_name: string;

    @IsOptional()
    location: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    start_date: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    end_date: Date;

    @IsNotEmpty()
    @IsNumber()
    project_id: number;
}
