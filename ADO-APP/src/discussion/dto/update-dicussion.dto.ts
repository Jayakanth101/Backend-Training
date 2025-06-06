import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateDiscussionDto {
    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsDate()
    createdat?: Date;
}

