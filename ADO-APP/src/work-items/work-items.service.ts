import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "./work-items.entity";
import { Repository } from "typeorm";
import { CreateWorkItemDto } from "./dto/create-work-item-dto";
import { UpdateWorkItemDto } from "./dto/update-work-item-dto";
import { Planning } from "src/planning/planning.entity";

@Injectable()
export class WorkItemsService {

    constructor(
        @InjectRepository(WorkItem)
        private WorkItemsRepository: Repository<WorkItem>,

        @InjectRepository(Planning)
        private PlanningRepository: Repository<Planning>
    ) { }

    findAll(): Promise<WorkItem[]> {
        return this.WorkItemsRepository.find();
    }

    async CreateWorkItem(createWorkItemDto: CreateWorkItemDto
    ): Promise<WorkItem> {
        if (createWorkItemDto.parentid != null) {
            const parent = await this.WorkItemsRepository.findOneBy({ id: createWorkItemDto.parentid });

            if (!parent) {
                throw new BadRequestException("Parent workItem not found");
            }
        }

        const workitem =
            this.WorkItemsRepository.create(createWorkItemDto);
        return await this.WorkItemsRepository.save(workitem);
    }

    async UpdateWorkItem(id: number, updatedDto: UpdateWorkItemDto
    ): Promise<WorkItem> {
        const workItem = await this.WorkItemsRepository.findOne({ where: { id }, relations: ['planning'] });
        if (!workItem) {
            throw new NotFoundException(`workitem with id ${id} not found`);
        }
        Object.assign(workItem, updatedDto);
        if (updatedDto.planning) {
            if (workItem.planning) {
                Object.assign(workItem.planning, updatedDto.planning);
            }
            else {
                workItem.planning = this.PlanningRepository.create({
                    ...updatedDto.planning,
                });
            }
        }
        return this.WorkItemsRepository.save(workItem);
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
