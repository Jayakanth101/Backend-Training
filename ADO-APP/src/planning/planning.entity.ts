import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"
import { Risk } from "src/work-items/enum/work-items-enum";
import { WorkItem } from "src/work-items/work-items.entity";

@Entity('planning')
export class Planning {

    @PrimaryColumn()
    workitemid: number;

    @OneToOne(() => WorkItem, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workitemid' })
    workitem: WorkItem;

    @Column()
    priority: number;

    @Column({ type: 'enum', enum: Risk })
    risk: Risk;

    @Column()
    effort: number;

    @Column()
    businessvalue: number;

    @Column()
    timecriticality: number;

    @Column({ type: 'timestamp' })
    startdate: Date;

    @Column({ type: 'timestamp' })
    targetdate: Date;

}
