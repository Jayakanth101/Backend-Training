import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Planning } from "./planning.entity";
import { Repository } from "typeorm";
import { CreatePlanningDto } from "./dto/planning.dto";
import { WorkItem } from "src/work-items/work-items.entity";


@Injectable()
export class PlanningService {
    constructor(
        @InjectRepository(Planning)
        private planningRepository: Repository<Planning>,

        @InjectRepository(WorkItem)
        private workItemRepository: Repository<WorkItem>,
    ) { }

    async create(createPlanningDto: CreatePlanningDto): Promise<string> {
        const workitemid = createPlanningDto.workitemid;
        await this.findOne(workitemid);
        const existing = await this.planningRepository.findOneBy({ workitemid });
        if (existing) {
            throw new ConflictException(`Planning for workitem id ${workitemid} already exists`);
        }
        const planning = this.planningRepository.create(createPlanningDto);
        await this.planningRepository.save(planning);
        return `Planning for workitem id ${createPlanningDto.workitemid} is created`;
    }

    async findOne(id: number): Promise<WorkItem> {
        const workitem = await this.workItemRepository.findOneBy({ id });
        if (!workitem) {
            throw new NotFoundException(`Work item with id ${id} not found`);
        }
        return workitem;

    }

}
