import { ApiProperty } from '@nestjs/swagger';
import { Tags } from '../tag.entity';

export class CreateTagSwaggerDto {
    @ApiProperty({ type: () => Tags })
    Tags: Tags;

    @ApiProperty({ example: 'Tag created successfully' })
    Message: string;
}

export class GetAllTagsSwaggerDto {
    @ApiProperty({ type: () => [Tags] })
    Tags: Tags[];
}

export class UpdateTagSwaggerDto {
    @ApiProperty({ type: () => Tags })
    Tag: Tags;

    @ApiProperty({ example: 'Tag updated successfully' })
    Message: string;
}

export class RemoveTagSwaggerDto {
    @ApiProperty({ example: 'Tag removed from work item successfully' })
    message: string;
}

