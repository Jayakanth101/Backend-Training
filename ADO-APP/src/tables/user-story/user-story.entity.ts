import { WorkItem } from "../../work-items/work-items.entity";
import { ChildEntity, Column, Entity } from "typeorm";


@ChildEntity()
export class UserStoryEntity extends WorkItem {

    @Column({ nullable: true })
    acceptance_criteria: string;
}
