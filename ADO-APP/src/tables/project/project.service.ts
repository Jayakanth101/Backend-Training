import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProjectEntity } from "./project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectEntityDto } from "./dto/project.dto";
import { ProjectUpdateDto } from "./dto/project-update.dto";
import { User } from "../../users/users.entity";
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectEntity)
        private ProjectRepository: Repository<ProjectEntity>,
        @InjectRepository(User)
        private UserRepository: Repository<User>,
    ) { }

    async createProject(dto: ProjectEntityDto): Promise<ProjectEntity> {
        try {
            const id = dto.project_creator_id;
            const user = this.UserRepository.findOneBy({ id });
            if (!user) {
                throw new NotFoundException(`User not found`);
            }

            const project = this.ProjectRepository.create(dto);
            return await this.ProjectRepository.save(project);
        }
        catch (err) {
            if (err) {
                throw new err;
            }
            throw new InternalServerErrorException(`Unexpected error during project creation: ${err}`);

        }
    }

    async findProject(project_id: number): Promise<ProjectEntity | null> {
        const project = await this.ProjectRepository.findOne({
            where: { project_id },
            relations: ['members', 'work_items']
        });

        if (!project) {
            throw new NotFoundException(`Project not found`);
        }

        return project;
    }

    async updateProject(id: number, new_project: ProjectUpdateDto): Promise<ProjectEntity> {

        const project = await this.findProject(id);
        if (!project) {
            throw new NotFoundException(`Project not found`);
        }
        Object.assign(project, new_project);

        return await this.ProjectRepository.save(project);
    }

    async deleteProject(project_id: number): Promise<string> {

        const project = await this.findProject(project_id);
        if (!project) {
            throw new NotFoundException(`Project not found`);
        }

        this.ProjectRepository.delete(project_id);

        return `${project_id} is deleted successfully`;
    }

    async findAllProjects(): Promise<ProjectEntity[]> {
        const projects = await this.ProjectRepository.find();
        return projects;
    }

}
