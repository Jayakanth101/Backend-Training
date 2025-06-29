import { WorkItem } from "../work-items/work-items.entity";
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tags')
export class Tags {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    tagname: string;

    @ManyToMany(() => WorkItem, (workitem) => workitem.tags)
    workitems: WorkItem[]
}
