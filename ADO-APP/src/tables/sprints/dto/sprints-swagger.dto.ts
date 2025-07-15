import { ApiProperty } from '@nestjs/swagger';
import { SprintEntity } from '../sprints.entity';

export class SprintCreatedSwaggerDto {
    @ApiProperty({ type: () => SprintEntity })
    Sprint: SprintEntity;

    @ApiProperty({ example: 'Sprint created successfully' })
    Message: string;
}

export class AllSprintsSwaggerDto {
    @ApiProperty({ type: () => [SprintEntity] })
    Sprint: SprintEntity[];
}

export class SingleSprintSwaggerDto {
    @ApiProperty({ type: () => SprintEntity })
    Sprint: SprintEntity;
}

export class DeleteSprintSwaggerDto {
    @ApiProperty({ example: 'Sprint deleted successfully' })
    Message: string;
}

export class UpdateSprintSwaggerDto {
    @ApiProperty({ type: () => SprintEntity })
    Sprint: SprintEntity;

    @ApiProperty({ example: 'Sprint updated successfully' })
    Message: string;
}

