import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MembersProjectResponseDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    project_id: number;

    @ApiProperty({ example: 'Inventory Management System' })
    @IsString()
    @IsNotEmpty()
    project_name: string;
}

