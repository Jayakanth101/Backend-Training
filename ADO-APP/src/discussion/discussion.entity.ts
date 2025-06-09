import { User } from "src/users/users.entity";
import { WorkItem } from "src/work-items/work-items.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"


@Entity('discussion')
export class Discussion {

    @PrimaryGeneratedColumn()
    commentid: number;

    @ManyToOne(() => WorkItem, { onDelete: 'CASCADE' })
    workitem: WorkItem;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'creatorid' })
    creator: User;

    @Column()
    message: string;

    @Column({ type: 'timestamp' })
    createdat: Date;

}
