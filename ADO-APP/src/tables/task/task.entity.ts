import { WorkItem } from "src/work-items/work-items.entity";
import { Entity, Column, ChildEntity } from "typeorm"

@ChildEntity()
@Entity('task_entity')
export class TaskEntity extends WorkItem {

    @Column({ nullable: true })
    original_estimates: number;

    @Column({ nullable: true })
    remianing: number;

    @Column({ nullable: true })
    completed: number;

    @Column({ nullable: true })
    implementation: string;
}
