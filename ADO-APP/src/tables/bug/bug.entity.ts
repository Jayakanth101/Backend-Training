import { WorkItem } from 'src/work-items/work-items.entity';
import { Entity } from 'typeorm';

@Entity('bug')
export class Bug extends WorkItem { }

