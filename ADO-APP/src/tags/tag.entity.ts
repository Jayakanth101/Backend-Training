import { WorkItem } from '../work-items/work-items.entity';
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tags')
export class Tags {
    @ApiProperty({ example: 1, description: 'Unique identifier for the tag' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'backend', description: 'The name of the tag' })
    @Column({ unique: true })
    tagname: string;

    @ApiProperty({
        type: () => [WorkItem],
        description: 'Work items associated with this tag',
        required: false,
    })
    @ManyToMany(() => WorkItem, (workitem) => workitem.tags)
    workitems: WorkItem[];
}

