import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { WorkItem } from "src/work-items/work-items.entity";
import { ProjectEntity } from "../project/project.entity";


@Entity('sprint')
export class SprintEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProjectEntity, (project) => project.sprints)
    project: ProjectEntity;

    @OneToMany(() => WorkItem, (workitem) => workitem.sprint)
    workitems: WorkItem[];

    @Column()
    sprint_name: string;

    @Column({ type: 'timestamp' })
    start_date: Date;

    @Column({ type: 'timestamp' })
    end_date: Date;

    @Column({ default: '' })
    location: string;
}
