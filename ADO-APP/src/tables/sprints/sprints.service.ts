import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SprintEntity } from "./sprints.entity";
import { SprintDto } from "./dto/sprints.dto";
import { ProjectEntity } from "../project/project.entity";
import { UpdateSprintDto } from "./dto/update-sprint.dto";

@Injectable()
export class SprintService {
    constructor(
        @InjectRepository(SprintEntity)
        private readonly repo: Repository<SprintEntity>,

        @InjectRepository(ProjectEntity)
        private readonly ProjectRepo: Repository<ProjectEntity>
    ) { }

    async createSprint(project_id: number, sprintDto: SprintDto): Promise<SprintEntity> {
        if (!project_id || typeof project_id !== 'number') {
            throw new BadRequestException('Invalid or missing project_id');
        }

        if (!sprintDto.sprint_name || sprintDto.sprint_name.trim() === '') {
            throw new BadRequestException('Sprint name is required');
        }

        const project = await this.ProjectRepo.findOneBy({ project_id });
        if (!project) throw new BadRequestException('Project not found');

        const sprint = this.repo.create({
            ...sprintDto,
            project: { project_id },
            location: sprintDto.location || project.project_name,
        });

        return await this.repo.save(sprint);
    }

    async getAllSprint(): Promise<SprintEntity[]> {
        return await this.repo.find();
    }

    async deleteSprint(sprint_id: number) {
        if (!sprint_id || typeof sprint_id !== 'number') {
            throw new BadRequestException('Invalid sprint_id');
        }

        const sprint = await this.repo.findOneBy({ id: sprint_id });
        if (!sprint) throw new BadRequestException(`Sprint with id ${sprint_id} does not exist`);

        return await this.repo.delete(sprint_id);
    }

    async getSprintById(sprint_id: number): Promise<SprintEntity | null> {
        if (!sprint_id || typeof sprint_id !== 'number') {
            throw new BadRequestException('Invalid sprint_id');
        }

        const sprint = await this.repo.findOneBy({ id: sprint_id });
        if (!sprint) throw new BadRequestException(`Sprint with id ${sprint_id} not found`);

        return sprint;
    }

    async updateSprint(sprintId: number, dto: UpdateSprintDto): Promise<SprintEntity> {
        if (!sprintId || typeof sprintId !== 'number') {
            throw new BadRequestException('Invalid sprintId');
        }

        const sprint = await this.repo.findOne({
            where: { id: sprintId },
            relations: ['project'],
        });

        if (!sprint) {
            throw new BadRequestException(`Sprint with id ${sprintId} not found`);
        }

        if (
            dto.start_date &&
            dto.end_date &&
            new Date(dto.end_date) < new Date(dto.start_date)
        ) {
            throw new BadRequestException('End date cannot be earlier than start date');
        }

        if (dto.sprint_name !== undefined) {
            if (dto.sprint_name.trim() === '') {
                throw new BadRequestException('Sprint name cannot be empty');
            }
            sprint.sprint_name = dto.sprint_name;
        }

        if (dto.location !== undefined) {
            if (dto.location.trim() === '') {
                throw new BadRequestException('Location cannot be empty');
            }
            sprint.location = dto.location;
        }

        if (dto.start_date !== undefined) sprint.start_date = dto.start_date;
        if (dto.end_date !== undefined) sprint.end_date = dto.end_date;

        return await this.repo.save(sprint);
    }
}

