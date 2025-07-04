import { WorkItem } from "../../work-items/work-items.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectMemberEntity } from "../project-member/project-member.entity";
import { User } from "../../users/users.entity";
import { SprintEntity } from "../sprints/sprints.entity";

@Entity('project')
export class ProjectEntity {

    @PrimaryGeneratedColumn()
    project_id: number;

    @Column({ nullable: true })
    project_description: string;

    @Column()
    project_name: string;

    @OneToMany(() => SprintEntity, (sprint) => sprint.project, { nullable: true })
    sprints: SprintEntity[]

    @OneToMany(() => WorkItem, (workitem) => workitem.project, { cascade: true, nullable: true })
    work_items: WorkItem[];

    @ManyToOne(() => User, (user) => user.created_projects, { cascade: true, nullable: true })
    project_creator: User;

    @OneToMany(() => ProjectMemberEntity, (pm) => pm.project, { cascade: true, nullable: true })
    members: ProjectMemberEntity[];

}
