import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateDiscussionDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    commentid: number;

    @ApiProperty({ example: 10 })
    @IsInt()
    @IsNotEmpty()
    workitemid: number;

    @ApiProperty({ example: 5 })
    @IsInt()
    @IsNotEmpty()
    creatorid: number;

    @ApiProperty({ example: 'Initial discussion comment' })
    @IsString()
    message?: string;

    @ApiProperty({ example: '2025-07-11T10:00:00Z' })
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    createdat: Date;
}

