import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "./work-items.entity";
import { Repository } from "typeorm";
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
import { UpdateFeatureDto } from "src/tables/feature/dto/update-feature.dto";
import { UpdateEpicDto } from "src/tables/epic/dto/update-epic.dto";
import { UpdateUserStoryDto } from "src/tables/user-story/dto/update-user-story.dto";
import { UpdateTaskDto } from "src/tables/task/dto/update-task.dto";
import { WorkItemFilterDto } from "./dto/work-item-filter.dto";

@Injectable()
export class WorkItemsService {

    constructor(
        @InjectRepository(WorkItem)
        private WorkItemsRepository: Repository<WorkItem>,

        @InjectRepository(Planning)
        private PlanningRepository: Repository<Planning>
    ) { }

    async findAll(): Promise<WorkItem[]> {
        return await this.WorkItemsRepository.find();
    }

    async CreateWorkItem(dto: FeatureDto | EpicDto | UserStoryDto | TaskDto
    ): Promise<WorkItem> {

        let entity: WorkItem;

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

    async getFilteredWorkItems(filterDto: WorkItemFilterDto) {
        const {
            id,
            type,
            assigned_to,
            state,
            area_path,
            tags,
            recently_updated,
            recently_created,
            recently_completed,
            keyword
        } = filterDto;

        const query = this.WorkItemsRepository.createQueryBuilder('workitem');

        if (id) {
            query.andWhere('workitem.id = :id', { id });
        }

        if (type) {
            query.andWhere('workitem.type = :type', { type });
        }

        if (assigned_to) {
            query.andWhere('workitem.assigned_to = :assigned_to', { assigned_to });
        }

        if (state) {
            query.andWhere('workitem.state = :state', { state });
        }

        if (area_path) {
            query.andWhere('workitem.area_path= :area_path', { area_path });
        }

        if (tags) {
            const tagArray = tags.map((tag) => tag.tagname);
            query.leftJoin('workitem.tags', 'tags')
                .andWhere('tags.name IN (:...tagArray)', { tagArray })
        }

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        if (recently_created) {
            query.andWhere('workitem.created_at > :createdAfter',
                { createdAfter: oneDayAgo });
            query.orderBy('workitem.created_at', 'DESC');
        }
        if (recently_updated) {
            query.andWhere('workitem.updated_at> :updatedAfter',
                { updatedAfter: oneDayAgo });
            query.orderBy('workitem.updated_at', 'DESC');
        }
        if (recently_completed) {
            query.andWhere('workitem.completed_at > :completedAfter',
                { completedAfter: oneDayAgo });
            query.orderBy('workitem.completed_at', 'DESC');
        }
        if (keyword) {
            query.andWhere('workitem.title ILIKE :keyword OR workitem.description ILIKE :keyword', { keyword: '%${keyword}%' });
        }

        return await query.getMany();
    }

    async DeleteWorkItem(id: number): Promise<string> {
        const existing = await this.WorkItemsRepository.findOneBy({ id });
        if (!existing) {
            throw new NotFoundException(`workitem with id ${id} not found`);
        }
        await this.WorkItemsRepository.delete(id);

        return `Successfully deleted ${id}`;
    }

}
