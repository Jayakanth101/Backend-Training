import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateDiscussionDto {
    @IsInt()
    @IsNotEmpty()
    commentid: number;

    @IsInt()
    @IsNotEmpty()
    workitemid: number;

    @IsInt()
    @IsNotEmpty()
    creatorid: number;

    @IsString()
    message?: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    createdat: Date;
}

