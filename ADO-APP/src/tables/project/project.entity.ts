import { WorkItem } from "src/work-items/work-items.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectMemberEntity } from "../project-member/project-member.entity";
import { User } from "src/users/users.entity";

@Entity('project')
export class ProjectEntity {

    @PrimaryGeneratedColumn()
    project_id: number;

    @Column()
    project_name: string;

    @OneToMany(() => WorkItem, (workitem) => workitem.project, { cascade: true })
    work_items: WorkItem[];

    @ManyToOne(() => User, (user) => user.created_projects, { cascade: true })
    project_creator: User;

    @OneToMany(() => ProjectMemberEntity, (pm) => pm.project, { cascade: true })
    members: ProjectMemberEntity[];
}
