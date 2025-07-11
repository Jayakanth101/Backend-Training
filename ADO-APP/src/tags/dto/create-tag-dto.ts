import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
    @ApiProperty({ example: 'frontend', description: 'Tag name to categorize work items' })
    @IsNotEmpty()
    @IsString()
    tagname: string;
}

