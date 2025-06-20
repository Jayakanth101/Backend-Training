import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SprintDto {

    @IsOptional()
    @IsString()
    sprint_name?: string;

    @IsOptional()
    location?: string;

    @IsOptional()
    @IsDate()
    start_date?: Date;

    @IsOptional()
    @IsDate()
    end_date?: Date;
}
