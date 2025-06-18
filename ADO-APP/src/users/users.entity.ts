import { ProjectMemberEntity } from "src/tables/project-member/project-member.entity";
import { ProjectEntity } from "src/tables/project/project.entity";
import { WorkItem } from "src/work-items/work-items.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";


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
        (workitem) => workitem.assigned_to,
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
