import { Column, Entity, JoinTable, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Risk } from "src/work-items/enum/work-items-enum";
import { WorkItem } from "src/work-items/work-items.entity";
import { JoinColumn } from "typeorm";

@Entity('planning')
export class Planning {

    @PrimaryColumn()
    id: number;

    @OneToOne(() => WorkItem, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id' })
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
