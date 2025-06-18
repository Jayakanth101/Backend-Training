
import { WorkItem } from "src/work-items/work-items.entity";
import { ChildEntity, Column, Entity } from "typeorm"

@Entity('Epic')
export class EpicEntity extends WorkItem { }
