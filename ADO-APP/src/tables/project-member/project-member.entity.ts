import { User } from "../../users/users.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Column } from "typeorm"
import { ProjectEntity } from "../project/project.entity";
import { WorkItem } from "../../work-items/work-items.entity";

@Entity('project_member')
export class ProjectMemberEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => User,
        (user) => user.project_memberships,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(
        () => ProjectEntity,
        (project) => project.members,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'project_id' })
    project: ProjectEntity;

    @Column()
    role: string;

    @OneToMany(() => WorkItem, (workItem) => workItem.assignedTo, { nullable: true })
    assignedWorkItems: WorkItem[]
}
