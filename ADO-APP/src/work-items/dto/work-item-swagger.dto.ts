import { ApiProperty } from '@nestjs/swagger';
import { WorkItem } from '../work-items.entity';
import { WorkItemResponseDto } from './work-item-response.dto';

export class CreateWorkItemSwaggerDto {
    @ApiProperty({ type: () => WorkItem })
    Work_item: WorkItem;

    @ApiProperty({ example: 'Work item created successfully' })
    Message: string;
}

export class FilteredWorkItemsSwaggerDto {
    @ApiProperty({ type: () => [WorkItemResponseDto] })
    Work_item: WorkItemResponseDto[];
}

export class WorkItemByIdSwaggerDto {
    @ApiProperty({ type: () => WorkItem })
    Work_item: WorkItem;
}

export class AllWorkItemsSwaggerDto {
    @ApiProperty({ type: () => [WorkItem] })
    Work_item: WorkItem[];
}

export class UpdateWorkItemSwaggerDto {
    @ApiProperty({ type: () => WorkItem })
    work_item: WorkItem;

    @ApiProperty({ example: 'Work item updated successfully' })
    Message: string;
}

export class DeleteWorkItemSwaggerDto {
    @ApiProperty({ example: 'Work item deleted successfully' })
    Message: string;
}

