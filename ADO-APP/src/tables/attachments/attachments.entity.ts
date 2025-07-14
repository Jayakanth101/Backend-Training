import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('attachments')
export class Attachment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    mimetype: string;

    @Column()
    size: number;

    @Column()
    path: string;

    @Column({ default: 'pending' })
    status: string;

    @Column()
    workItemId: number;

    @Column()
    uploadedById: number;

    @CreateDateColumn()
    createdAt: Date;
}

