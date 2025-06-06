import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "./work-items.entity";
import { Repository } from "typeorm";
import { CreateWorkItemDto } from "./dto/create-work-item-dto";

@Injectable()
export class WorkItemsService {

    constructor(
        @InjectRepository(WorkItem)
        private WorkItemsRepository: Repository<WorkItem>,
    ) { }

    findAll(): Promise<WorkItem[]> {
        return this.WorkItemsRepository.find();
    }

    async CreateWorkItem(createWorkItemDto: CreateWorkItemDto): Promise<WorkItem> {

        const existing = await this.WorkItemsRepository.findOne({ where: { id: createWorkItemDto.id } });
        if (existing) {
            throw new ConflictException(`Work item with id ${createWorkItemDto.id} already exists`);
        }
        const workitem = this.WorkItemsRepository.create(createWorkItemDto);
        return await this.WorkItemsRepository.save(workitem);
    }

    async UpdateWorkItem(id: number, updatedDto: Partial<WorkItem>) {
        const existing = await this.WorkItemsRepository.findOneBy({ id });
        if (!existing) {
            throw new NotFoundException(`workitem with id ${id} not found`);
        }

        await this.WorkItemsRepository.update(id, updatedDto);
        return this.WorkItemsRepository.findOneBy({ id });
    }

    async findOne(id: number): Promise<WorkItem | null> {
        const workItem = await this.WorkItemsRepository.findOneBy({ id });

        if (!workItem) {
            throw new NotFoundException(`workitem with id ${id} not found`);
        }
        return workItem;
    }

    async DeleteWorkItem(id: number): Promise<void> {
        const existing = await this.WorkItemsRepository.findOneBy({ id });
        if (!existing) {
            throw new NotFoundException(`workitem with id ${id} not found`);
        }
        await this.WorkItemsRepository.delete(id);
    }
}
