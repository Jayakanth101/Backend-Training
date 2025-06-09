import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";

import { State, Type } from "./enum/work-items-enum"
import { Discussion } from "src/discussion/discussion.entity";
import { Planning } from "src/planning/planning.entity";

@Entity('workitem')
export class WorkItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: Type,
    })
    type: Type;

    @Column()
    title: string;

    @Column({
        type: 'enum',
        enum: State,
    })

    state: State;

    @Column({ type: 'timestamp' })
    startdate: Date;

    @Column()
    createdby: number;

    @Column({ type: 'timestamp' })
    targetdate: Date;

    @Column()
    description: string;

    @Column()
    assignto: number;

    @Column({ type: 'timestamp' })
    activitydate: Date;

    @Column()
    areapath: string;

    @Column()
    classification: string;

    @Column({ nullable: true })
    parentid: number;

    @ManyToOne(
        () => WorkItem, workitem => workitem.childrens,
        {
            nullable: true,
            onDelete: 'SET NULL'
        }
    )
    @JoinColumn({ name: 'parentid' })
    parent: WorkItem;

    @OneToMany(() => WorkItem, workitem => workitem.parent)
    childrens: WorkItem[];


    @OneToMany(() => Discussion, discussion => discussion.workitem, { cascade: true })
    @JoinColumn()
    discussion: Discussion[];

    @OneToOne(() => Planning, planning => planning.workitem, { cascade: true })
    // @JoinColumn({ name: 'id' })
    planning: Planning;

}
