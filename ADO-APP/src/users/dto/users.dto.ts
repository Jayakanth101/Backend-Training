import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

    @ApiProperty({ description: "Name of the user", example: "Ashok", required: true })
    @IsNotEmpty()
    @IsString()
    displayname: string;

    @ApiProperty({ description: "Email of the user", example: "Ashok@gmail.com", required: true })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ example: "password", required: true })
    @IsNotEmpty()
    @IsString()
    password: string;

}
