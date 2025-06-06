
import { Unique, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('User')
@Unique(['displayname'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    displayname: string;

}
