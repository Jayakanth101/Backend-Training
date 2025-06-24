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
import { Discussion } from "src/discussion/discussion.entity";
import { Tags } from "src/tags/tag.entity";
import { Planning } from "src/planning/planning.entity";
import { ProjectEntity } from "src/tables/project/project.entity";
import { ProjectMemberEntity } from "src/tables/project-member/project-member.entity";
import { User } from "src/users/users.entity";
import { SprintEntity } from "src/tables/sprints/sprints.entity";
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
    assignedTo: ProjectMemberEntity;

    @Column({ nullable: true })
    assigned_to: number;

    @Column({ type: 'timestamp' })
    activity_date: Date;

    @Column()
    area_path: string;

    @Column({ nullable: true })
    iteration: string;

    // @BeforeInsert()
    // setIeration() {
    //     if (!this.iteration) {
    //         this.iteration = this.area_path;
    //     }
    // }

    @Column({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'timestamp' })
    completed_at: Date;

    @OneToMany(() => Discussion, discussion => discussion.workitem, { cascade: true })
    @JoinColumn()
    discussion: Discussion[];

    @ManyToMany(() => Tags, (tag) => tag.workitems)
    @JoinTable()
    tags: Tags[]

    @ManyToOne(() => ProjectEntity, (project) => project.work_items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: ProjectEntity;

    @Column()
    classification: string;

    @ManyToOne(() => WorkItem, (parent) => parent.childrens, { nullable: true })
    parent: WorkItem;

    @OneToMany(() => WorkItem, (child) => child.parent, { nullable: true })
    childrens: WorkItem[];

    @OneToOne(() => Planning, (planning) => planning.work_item, { cascade: true })
    @JoinColumn({ name: 'planning_id' })
    planning: Planning;

    @ManyToOne(() => SprintEntity, (sprint) => sprint.workitems, { onDelete: 'SET NULL' })
    sprint: SprintEntity;

    @Column({ nullable: true })
    sprint_id: number;

}
