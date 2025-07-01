import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "./work-items.entity";
import { Repository } from "typeorm";
import { Planning } from "../planning/planning.entity";
import { Type } from "./enum/work-items-enum";
import { FeatureEntity } from "../tables/feature/feature.entity";
import { FeatureDto } from "../tables/feature/dto/feature.dto";
import { EpicDto } from "../tables/epic/dto/epic.dto";
import { UserStoryDto } from "../tables/user-story/dto/user-story.dto";
import { TaskDto } from "../tables/task/dto/task.dto";
import { EpicEntity } from "../tables/epic/epic.entity";
import { UserStoryEntity } from "../tables/user-story/user-story.entity";
import { TaskEntity } from "../tables/task/task.entity";
import { UpdateFeatureDto } from "../tables/feature/dto/update-feature.dto";
import { UpdateEpicDto } from "../tables/epic/dto/update-epic.dto";
import { UpdateUserStoryDto } from "../tables/user-story/dto/update-user-story.dto";
import { UpdateTaskDto } from "../tables/task/dto/update-task.dto";
import { WorkItemFilterDto } from "./dto/work-item-filter.dto";
import { User } from "../../src/users/users.entity";
import { ProjectMemberEntity } from "../../src/tables/project-member/project-member.entity";
import { ProjectEntity } from "../../src/tables/project/project.entity";
import { Bug } from "../../src/tables/bug/bug.entity";
import { WorkItemResponseDto } from "./dto/work-item-response.dto";
import { plainToInstance } from "class-transformer";
@Injectable()
export class WorkItemsService {

    constructor(
        @InjectRepository(WorkItem)
        private WorkItemsRepository: Repository<WorkItem>,

        @InjectRepository(Planning)
        private PlanningRepository: Repository<Planning>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(ProjectMemberEntity)
        private memberRepo: Repository<ProjectMemberEntity>,

        @InjectRepository(ProjectEntity)
        private projectRepo: Repository<ProjectEntity>,

        @InjectRepository(EpicEntity)
        private epicRepo: Repository<EpicEntity>,

        @InjectRepository(Bug)
        private bugRepo: Repository<Bug>,

        @InjectRepository(FeatureEntity)
        private featureRepo: Repository<FeatureEntity>,

        @InjectRepository(UserStoryEntity)
        private userStoryRepo: Repository<UserStoryEntity>,

        @InjectRepository(TaskEntity)
        private taskRepo: Repository<TaskEntity>,

    ) { }

    async findAll(): Promise<WorkItem[]> {
        return await this.WorkItemsRepository.find();
    }

    async CreateWorkItem(dto: EpicDto | TaskDto | FeatureDto | UserStoryDto): Promise<WorkItem> {
        const user = await this.userRepo.findOne({ where: { id: dto.created_by } });
        if (!user) throw new BadRequestException(`User not found`);

        const project = await this.projectRepo.findOne({ where: { project_id: dto.project_id } });
        if (!project) throw new BadRequestException(`Project not found`);

        const assignee = dto.assigned_to
            ? await this.memberRepo.findOne({ where: { id: dto.assigned_to } })
            : null;

        const now = new Date();
        const base_props = {
            ...dto,
            created_at: now,
            updated_at: now,
            completed_at: now,
            created_by: user,
            project: project,
            assignedTo: assignee ?? null,
        };

        switch (dto.type) {
            case Type.Epic: {
                const entity = this.epicRepo.create(base_props);
                return await this.epicRepo.save(entity);
            }
            case Type.Feature: {
                const entity = this.featureRepo.create(base_props);
                return await this.featureRepo.save(entity);
            }
            case Type.UserStory: {
                const entity = this.userStoryRepo.create(base_props);
                return await this.userStoryRepo.save(entity);
            }
            case Type.Task: {
                const entity = this.taskRepo.create(base_props);
                return await this.taskRepo.save(entity);
            }
            case Type.Bug: {
                const entity = this.bugRepo.create(base_props);
                return await this.bugRepo.save(entity);
            }
            default:
                throw new BadRequestException("Invalid work item type");
        }

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
        if (workItem instanceof TaskEntity) {
            return this.taskRepo.save(workItem);
        }
        if (workItem instanceof FeatureEntity) {
            return this.featureRepo.save(workItem);
        }
        if (workItem instanceof UserStoryEntity) {
            return this.userStoryRepo.save(workItem);
        }
        if (workItem instanceof EpicEntity) {
            return this.epicRepo.save(workItem);
        }
        if (workItem instanceof Bug) {
            return this.bugRepo.save(workItem);
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

    async getFilteredWorkItems(filterDto: WorkItemFilterDto): Promise<WorkItemResponseDto[]> {
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


        const query = this.WorkItemsRepository.createQueryBuilder('workitem')
            .leftJoinAndSelect('workitem.assignedTo', 'assignedTo')
            .leftJoinAndSelect('workitem.created_by', 'created_by');

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
            query.andWhere('workitem.updated_at > :updatedAfter',
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

        const result = await query.getMany();
        return plainToInstance(WorkItemResponseDto, result, { excludeExtraneousValues: true, });
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
