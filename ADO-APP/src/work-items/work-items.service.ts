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

    async findAllByProjectId(project_id: number): Promise<{ Work_item: WorkItem[] }> {
        const project = await this.projectRepo.findOneBy({ project_id });
        if (!project) {
            throw new NotFoundException(`Project id ${project_id}is not found`);
        }
        const work_items = await this.WorkItemsRepository.find({
            where: { project },
        });

        if (!work_items) {
            throw new NotFoundException(`Work item not found`);
        }

        return { Work_item: work_items };
    }

    async CreateWorkItem(dto: EpicDto | TaskDto | FeatureDto | UserStoryDto): Promise<{ Work_item: WorkItem, Message: string }> {
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
            project,
            assignedTo: assignee ?? null,
        };

        let createdWorkItem: WorkItem;

        switch (dto.type) {
            case Type.Epic:
                createdWorkItem = await this.epicRepo.save(this.epicRepo.create(base_props));
                break;
            case Type.Feature:
                createdWorkItem = await this.featureRepo.save(this.featureRepo.create(base_props));
                break;
            case Type.UserStory:
                createdWorkItem = await this.userStoryRepo.save(this.userStoryRepo.create(base_props));
                break;
            case Type.Task:
                console.log("About to save the task item");
                createdWorkItem = await this.taskRepo.save(this.taskRepo.create(base_props));
                break;
            case Type.Bug:
                createdWorkItem = await this.bugRepo.save(this.bugRepo.create(base_props));
                break;
            default:
                throw new BadRequestException("Invalid work item type");
        }

        return {
            Work_item: createdWorkItem,
            Message: `Work item ${dto.type} created successfully`,
        };
    }

    async UpdateWorkItem(
        id: number,
        dto: UpdateFeatureDto | UpdateEpicDto | UpdateUserStoryDto | UpdateTaskDto
    ): Promise<{ work_item: WorkItem, Message: string }> {
        // Step 1: Fetch only to get the type
        const baseItem = await this.WorkItemsRepository.findOne({ where: { id } });
        if (!baseItem) {
            throw new NotFoundException(`workitem with id ${id} not found`);
        }

        // Step 2: Determine type and fetch full object from correct repo
        let fullItem: WorkItem | null;
        switch (baseItem.type) {
            case Type.Task:
                fullItem = await this.taskRepo.findOne({ where: { id }, relations: ['planning'] });
                break;
            case Type.Feature:
                fullItem = await this.featureRepo.findOne({ where: { id }, relations: ['planning'] });
                break;
            case Type.UserStory:
                fullItem = await this.userStoryRepo.findOne({ where: { id }, relations: ['planning'] });
                break;
            case Type.Epic:
                fullItem = await this.epicRepo.findOne({ where: { id }, relations: ['planning'] });
                break;
            case Type.Bug:
                fullItem = await this.bugRepo.findOne({ where: { id }, relations: ['planning'] });
                break;
            default:
                throw new NotFoundException(`Unknown work item type for id ${id}`);
        }

        if (!fullItem) {
            throw new NotFoundException(`workitem with id ${id} not found in derived repository`);
        }


        // Step 3: Apply updates
        Object.assign(fullItem, dto);
        fullItem.created_by = baseItem.created_by;

        if (dto.planning) {
            if (fullItem.planning) {
                Object.assign(fullItem.planning, dto.planning);
            } else {
                fullItem.planning = this.PlanningRepository.create({ ...dto.planning });
            }
        }

        // Step 4: Save through correct repo
        let savedWorkItem: any;
        switch (baseItem.type) {
            case Type.Task: {

                savedWorkItem = await this.taskRepo.save(fullItem);
                break;
            }
            case Type.Feature: {
                savedWorkItem = await this.featureRepo.save(fullItem);
                break;
            }
            case Type.UserStory: {
                savedWorkItem = await this.userStoryRepo.save(fullItem);
                break;
            }
            case Type.Epic: {
                savedWorkItem = await this.epicRepo.save(fullItem);
                break;
            }
            case Type.Bug: {
                savedWorkItem = await this.bugRepo.save(fullItem);
                break;
            }
        }

        return {
            work_item: savedWorkItem,
            Message: `Work item ${baseItem.type} type is updated successfully`
        };
    }

    async findOne(id: number): Promise<{ Work_item: WorkItem }> {
        const workItem = await this.WorkItemsRepository.findOne({
            where: { id },
            relations: ['planning']
        });
        if (!workItem) {
            throw new NotFoundException(`workitem with id ${id} not found`);
        }
        return { Work_item: workItem };
    }

    async getFilteredWorkItems(filterDto: WorkItemFilterDto): Promise<{
        Work_item: WorkItemResponseDto[]
    }> {
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
        const response = plainToInstance(WorkItemResponseDto, result, { excludeExtraneousValues: true, });
        return { Work_item: response };
    }

    async DeleteWorkItem(id: number): Promise<{ Message: string }> {
        const existing = await this.WorkItemsRepository.findOneBy({ id });
        if (!existing) {
            throw new NotFoundException(`workitem with id ${id} not found`);
        }
        await this.WorkItemsRepository.delete(id);

        return { Message: `Successfully deleted work item id ${id}` };
    }

}
