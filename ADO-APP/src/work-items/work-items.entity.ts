import {
    Column,
    Entity,
    JoinTable,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
    BeforeInsert,
    OneToOne
} from "typeorm";

import { State, Type } from "./enum/work-items-enum"
import { Discussion } from "../discussion/discussion.entity";
import { Tags } from "../tags/tag.entity";
import { Planning } from "../planning/planning.entity";
import { ProjectEntity } from "../tables/project/project.entity";
import { ProjectMemberEntity } from "../tables/project-member/project-member.entity";
import { User } from "../users/users.entity";
import { SprintEntity } from "../tables/sprints/sprints.entity";
import { Type as TransformType } from "class-transformer";

@Entity('workitem')
@TableInheritance({ column: { type: "varchar", name: "inheritance_type" } })
export class WorkItem {

    //primary key
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

    @ManyToOne(
        () => User,
        (user) => user.created_workitems,
        { eager: true },
    )
    @TransformType(() => Number)
    @JoinColumn({ name: 'created_by' })
    created_by: User;

    @Column()
    description: string;

    @ManyToOne(
        () => ProjectMemberEntity,
        (member) => member.assignedWorkItems,
        { nullable: true }
    )
    @JoinColumn({ name: 'assigned_to' })
    assignedTo: ProjectMemberEntity | null;

    @Column({ type: 'timestamp' })
    activity_date: Date;

    @Column()
    area_path: string;

    @Column({ nullable: true })
    iteration: string;

    @Column({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'timestamp' })
    completed_at: Date;

    @OneToMany(() => Discussion, discussion => discussion.workitem, { cascade: true })
    @JoinColumn()
    discussion: Discussion[];

    @ManyToMany(() => Tags, (tag) => tag.workitems, { nullable: true })
    @JoinTable()
    tags: Tags[]

    @ManyToOne(() => ProjectEntity, (project) => project.work_items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: ProjectEntity;

    @Column()
    classification: string;

    @ManyToOne(() => WorkItem, (parent) => parent.childrens, { nullable: true })
    parent: WorkItem | null;

    @OneToMany(() => WorkItem, (child) => child.parent, { nullable: true })
    childrens: WorkItem[];

    @OneToOne(() => Planning, (planning) => planning.work_item, { cascade: true })
    @JoinColumn({ name: 'planning_id' })
    planning: Planning | null;

    @ManyToOne(() => SprintEntity, (sprint) => sprint.workitems, { onDelete: 'SET NULL' })
    sprint: SprintEntity;

    @Column({ nullable: true })
    sprint_id: number;


}
