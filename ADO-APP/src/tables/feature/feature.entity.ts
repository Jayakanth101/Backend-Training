import { WorkItem } from "../../work-items/work-items.entity";
import { Entity } from "typeorm"


@Entity('feature')
export class FeatureEntity extends WorkItem {
}


