import { Column, Entity, PrimaryColumn } from "typeorm";

export enum Type {
    Epic = 'Epic',
    Feature = 'Feature',
    Bug = 'Bug',
    Task = 'Task',
    UserStory = 'UserStory'
}

export enum State {
    New = 'New',
    Active = 'Active',
    Resolved = 'Resolved',
    Closed = 'Closed',
    Removed = 'Removed'
}

@Entity('workitem')
export class WorkItems {

    @PrimaryColumn({ nullable: false })
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

}
