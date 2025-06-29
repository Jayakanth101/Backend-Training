import { WorkItem } from '../../work-items/work-items.entity';
import { ChildEntity, Entity } from 'typeorm';

@ChildEntity()
export class Bug extends WorkItem { }

