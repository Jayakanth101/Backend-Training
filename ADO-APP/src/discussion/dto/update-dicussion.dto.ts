import { IsDate, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDiscussionDto {
    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    createdat?: Date;
}

