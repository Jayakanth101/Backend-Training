import { User } from "src/users/users.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { ProjectEntity } from "../project/project.entity";
import { WorkItem } from "src/work-items/work-items.entity";

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

    @OneToMany(() => WorkItem, (workItem) => workItem.assignedTo, { nullable: true })
    assignedWorkItems: WorkItem[]
}
