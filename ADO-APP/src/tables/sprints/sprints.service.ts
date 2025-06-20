import { BadRequestException, Body, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { SprintEntity } from "./sprints.entity";
import { SprintDto } from "./dto/sprints.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectEntity } from "../project/project.entity";
import { UpdateSprintDto } from "./dto/update-sprint.dto";

@Injectable()
export class SprintService {
    constructor(
        @InjectRepository(SprintEntity) private readonly repo: Repository<SprintEntity>,
        @InjectRepository(ProjectEntity) private readonly ProjectRepo: Repository<ProjectEntity>
    ) { }

    async createSprint(project_id: number, sprintDto: SprintDto): Promise<SprintEntity> {

        const project = await this.ProjectRepo.findOneBy({ project_id: project_id });
        if (!project) throw new BadRequestException('Project not found');
        const sprint = this.repo.create({
            ...sprintDto,
            project,
            location: sprintDto.location || project.project_name,
        });
        return await this.repo.save(sprint);
    }

    async getAllSprint(): Promise<SprintEntity[]> {
        return await this.repo.find();
    }

    async delteSprint(sprint_id: number) {
        return await this.repo.delete(sprint_id);
    }

    async getSprintById(sprint_id: number): Promise<SprintEntity | null> {
        return await this.repo.findOneBy({ id: sprint_id });
    }

    async updateSprint(sprintId: number, dto: UpdateSprintDto): Promise<SprintEntity> {
        const sprint = await this.repo.findOne({
            where: { id: sprintId },
            relations: ['project'],
        });

        if (!sprint) {
            throw new BadRequestException(`Sprint with id ${sprintId} not found`);
        }

        if (dto.sprint_name !== undefined) sprint.sprint_name = dto.sprint_name;
        if (dto.location !== undefined) sprint.location = dto.location;
        if (dto.start_date !== undefined) sprint.start_date = dto.start_date;
        if (dto.end_date !== undefined) sprint.end_date = dto.end_date;

        return await this.repo.save(sprint);
    }

}
