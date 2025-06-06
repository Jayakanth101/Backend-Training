import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { State, Type } from "./enum/work-items-enum"
import { Discussion } from "src/discussion/discussion.entity";

@Entity('workitem')
export class WorkItem {
    @PrimaryColumn()
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

    @Column()
    parentid: number;

    @OneToMany(() => Discussion, discussion => discussion.workitem)
    discussion: Discussion[]

}
