
import { WorkItem } from "../../work-items/work-items.entity";
import { ChildEntity, Column, Entity } from "typeorm"


@ChildEntity()
export class EpicEntity extends WorkItem { }
