import { trace } from "console";
import { Discussion } from "src/discussion/discussion.entity";
import { ChildEntity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm"


@ChildEntity()
export class AttachmentsEntity {

    @PrimaryGeneratedColumn()
    attachment_id: number;

    @Column()
    attachment_name: string;

    @Column()
    attachment_link_s3: string;

    @ManyToMany(() => Discussion, (discussion) => discussion.commentid, { cascade: true })
    discussion: Discussion;

}
