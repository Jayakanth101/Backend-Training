import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({
        description: 'Username of the user',
        example: 'john_doe',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'password123',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}

