import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "./work-items.entity";
import { Repository } from "typeorm";
import { CreateWorkItemDto } from "./dto/create-work-item-dto";
import { UpdateWorkItemDto } from "./dto/update-work-item-dto";
import { Planning } from "src/planning/planning.entity";
import { Type } from "./enum/work-items-enum";
import { FeatureEntity } from "src/tables/feature/feature.entity";
import { FeatureDto } from "src/tables/feature/dto/feature.dto";
import { EpicDto } from "src/tables/epic/dto/epic.dto";
import { UserStoryDto } from "src/tables/user-story/dto/user-story.dto";
import { TaskDto } from "src/tables/task/dto/task.dto";
import { EpicEntity } from "src/tables/epic/epic.entity";
import { UserStoryEntity } from "src/tables/user-story/user-story.entity";
import { TaskEntity } from "src/tables/task/task.entity";
import { defaultMaxListeners } from "events";
import { UpdateFeatureDto } from "src/tables/feature/dto/update-feature.dto";
import { UpdateEpicDto } from "src/tables/epic/dto/update-epic.dto";
import { UpdateUserStoryDto } from "src/tables/user-story/dto/update-user-story.dto";
import { UpdateTaskDto } from "src/tables/task/dto/update-task.dto";

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

    async CreateWorkItem(dto: FeatureDto | EpicDto | UserStoryDto | TaskDto
    ): Promise<WorkItem> {

        let entity: WorkItem;
        console.log("--->");

        switch (dto.type) {
            case Type.Epic:
                console.log("epic");
                entity = Object.assign(new EpicEntity(), dto);
                break;
            case Type.Feature:
                console.log("feature");
                entity = Object.assign(new FeatureEntity(), dto);
                break;
            case Type.UserStory:
                console.log("user-story");
                entity = Object.assign(new UserStoryEntity(), dto);
                break;
            case Type.Task:
                console.log("task");
                entity = Object.assign(new TaskEntity(), dto);
                break;
            default:
                throw new BadRequestException("Invalid work item type");
        }
        const workitem = this.WorkItemsRepository.create(entity);
        return await this.WorkItemsRepository.save(workitem);
    }

    async UpdateWorkItem(
        id: number,
        dto: UpdateFeatureDto | UpdateEpicDto | UpdateUserStoryDto | UpdateTaskDto
    ): Promise<WorkItem> {

        const workItem = await this.WorkItemsRepository.
            findOne({ where: { id }, relations: ['planning'] });

        if (!workItem) {
            throw new NotFoundException(`workitem with id ${id} not found`);
        }
        Object.assign(workItem, dto);

        if (dto.planning) {
            if (workItem.planning) {
                Object.assign(workItem.planning, dto.planning);
            }
            else {
                workItem.planning = this.PlanningRepository.create({
                    ...dto.planning,
                });
            }
        }
        return this.WorkItemsRepository.save(workItem);
    }

    async findOne(id: number): Promise<WorkItem | null> {
        const workItem = await this.WorkItemsRepository.findOne({
            where: { id },
            relations: ['planning']
        });
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
