import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectMemberDto {
    @ApiProperty({ example: 2, description: 'User ID' })
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @ApiProperty({ example: 1, description: 'Project ID' })
    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @ApiProperty({ example: 'developer', description: 'Role in the project' })
    @IsNotEmpty()
    @IsString()
    role: string;
}

