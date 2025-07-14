import { Expose, Transform, Type as TransformType } from 'class-transformer';
import { State, Type } from '../enum/work-items-enum';
import { ApiProperty } from '@nestjs/swagger';

export class WorkItemResponseDto {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty({ enum: Type })
    @Expose()
    type: Type;

    @ApiProperty()
    @Expose()
    title: string;

    @ApiProperty({ enum: State })
    @Expose()
    state: State;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty()
    @Expose()
    area_path: string;

    @ApiProperty()
    @Expose()
    iteration: string;

    @ApiProperty()
    @Expose()
    classification: string;

    @ApiProperty({ type: Date })
    @Expose()
    @TransformType(() => Date)
    created_at: Date;

    @ApiProperty({ type: Date })
    @Expose()
    @TransformType(() => Date)
    updated_at: Date;

    @ApiProperty({ type: Date })
    @Expose()
    @TransformType(() => Date)
    completed_at: Date;

    @ApiProperty()
    @Expose()
    assigned_to: number;

    @ApiProperty({ example: { id: 2, displayname: 'Jane Doe' } })
    @Expose()
    assignedTo: {
        id: number;
        displayname: string;
    };

    @ApiProperty({ example: { id: 1, displayname: 'John Doe' } })
    @Expose()
    created_by: {
        id: number;
        displayname: string;
    };
}

