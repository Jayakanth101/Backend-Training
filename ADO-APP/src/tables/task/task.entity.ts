import { WorkItem } from "../../work-items/work-items.entity";
import { Entity, Column, ChildEntity } from "typeorm"

@ChildEntity()
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
