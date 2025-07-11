import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectMemberResponseDto {
    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    user_name: string;

    @ApiProperty({ example: 'developer' })
    @IsNotEmpty()
    @IsString()
    role: string;
}

