import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Risk } from "src/work-items/enum/work-items-enum";
import { WorkItem } from "src/work-items/work-items.entity";

@Entity('planning')
export class Planning {

    @PrimaryGeneratedColumn()
    planning_id: number;

    @OneToOne(() => WorkItem, (workitem) => workitem.planning, { onDelete: 'CASCADE' })
    work_item: WorkItem;

    @Column()
    priority: number;

    @Column({ nullable: true })
    story_point: number;

    @Column({ type: 'enum', enum: Risk, nullable: true })
    risk: Risk;

    @Column({ nullable: true })
    effort: number;

    @Column({ nullable: true })
    business_value: number;

    @Column({ nullable: true })
    time_criticality: number;

    @Column({ type: 'timestamp', nullable: true })
    start_date: Date;

    @Column({ type: 'timestamp', nullable: true })
    target_date: Date;

}
