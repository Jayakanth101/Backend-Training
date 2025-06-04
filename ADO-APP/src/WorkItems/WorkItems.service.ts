import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItems } from "./WorkItems.entity";
import { Repository } from "typeorm";
import { retry } from "rxjs";


@Injectable()
export class WorkItemsService {
    constructor(
        @InjectRepository(WorkItems)
        private WorkItemsRepository: Repository<WorkItems>,
    ) { }

    findAll(): Promise<WorkItems[]> {
        return this.WorkItemsRepository.find();
    }

    CreateEpic(workItems: WorkItems) {
        return this.WorkItemsRepository.save(workItems);
    }

    async UpdateEpic(id: number, updatedDto: Partial<WorkItems>) {
        await this.WorkItemsRepository.update(id, updatedDto);
        return this.WorkItemsRepository.findOneBy({ id });
    }

    findOne(id: number): Promise<WorkItems | null> {
        return this.WorkItemsRepository.findOneBy({ id });
    }

    async DeleteEpic(id: number): Promise<void> {
        await this.WorkItemsRepository.delete(id);
    }


}
