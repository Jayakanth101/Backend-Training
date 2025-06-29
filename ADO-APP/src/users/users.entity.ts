import { ProjectMemberEntity } from "../tables/project-member/project-member.entity";
import { ProjectEntity } from "../tables/project/project.entity";
import { WorkItem } from "../work-items/work-items.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";


@Entity('User')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    displayname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => ProjectEntity, (project) => project.project_creator)
    created_projects: ProjectEntity[];

    @OneToMany(
        () => WorkItem,
        (workitem) => workitem.assignedTo,
        { nullable: true }
    )
    assigned_projects: WorkItem[];

    @OneToMany(
        () => ProjectMemberEntity,
        (member) => member.user,
        { nullable: true }
    )
    project_memberships: ProjectMemberEntity[];

    @OneToMany(
        () => WorkItem,
        (workitem) => workitem.created_by,
        { nullable: true }
    )
    created_workitems: WorkItem[]

}
