import { Exclude, Expose, Transform, Type as TransformType } from 'class-transformer';
import { State, Type } from '../enum/work-items-enum';

export class WorkItemResponseDto {
    @Expose()
    id: number;

    @Expose()
    type: Type;

    @Expose()
    title: string;

    @Expose()
    state: State;

    @Expose()
    description: string;

    @Expose()
    area_path: string;

    @Expose()
    iteration: string;

    @Expose()
    classification: string;

    @Expose()
    @TransformType(() => Date)
    created_at: Date;

    @Expose()
    @TransformType(() => Date)
    updated_at: Date;

    @Expose()
    @TransformType(() => Date)
    completed_at: Date;

    @Expose()
    assigned_to: number;

    @Expose()
    assignedTo: {
        id: number;
        displayname: string;
    };

    @Expose()
    created_by: {
        id: number;
        displayname: string;
    };

}

