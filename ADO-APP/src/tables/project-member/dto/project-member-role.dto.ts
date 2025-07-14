import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectMemberRoleDto {
    @ApiProperty({ example: 'tester', description: 'New role for the member' })
    @IsNotEmpty()
    @IsString()
    role: string;
}

