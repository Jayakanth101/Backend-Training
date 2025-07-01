import { Injectable, NotFoundException } from "@nestjs/common";
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

    async createProject(dto: ProjectEntityDto): Promise<{ project: ProjectEntity }> {
        try {
            const id = dto.project_creator_id;
            const user = this.UserRepository.findOneBy({ id });
            if (!user) {
                throw new NotFoundException(`User not found`);
            }

            const project = this.ProjectRepository.create(dto);
            const savedProject = await this.ProjectRepository.save(project);
            return { project: savedProject }
        }
        catch (err) {
            if (err) {
                throw new err;
            }
            throw new InternalServerErrorException(`Unexpected error during project creation: ${err}`);
        }
    }

    async findProject(project_id: number): Promise<{ project: ProjectEntity }> {
        try {
            const project = await this.ProjectRepository.findOne({
                where: { project_id },
                relations: ['members', 'work_items']
            });

            if (!project) {
                throw new NotFoundException(`Project not found`);
            }

            return { project: project };
        }
        catch (err) {
            if (err) {
                throw new err;
            }
            throw new InternalServerErrorException(`Unexpected error while project by id: ${err}`);
        }
    }

    async updateProject(id: number, new_project: ProjectUpdateDto): Promise<{ project: ProjectEntity, message: string }> {

        try {

            const project = await this.ProjectRepository.findOneBy({ project_id: id });

            if (!project) {
                throw new NotFoundException(`Project not found`);
            }

            Object.assign(project, new_project);

            await this.ProjectRepository.save(project);
            const savedProject = await this.ProjectRepository.findOneBy({ project_id: id });
            if (!savedProject) {
                throw new NotFoundException(`Project not found`);
            }

            console.log("Updating: ", savedProject);
            return { project: savedProject, message: "Project updated successfully" };
        }
        catch (err) {
            if (err) {
                throw err;
            }
            throw new InternalServerErrorException(`Unexpected error while updating project by id: ${err}`);
        }
    }

    async deleteProject(project_id: number): Promise<{ message: string }> {
        console.log("Deleting the project");

        try {
            const project = await this.ProjectRepository.findOneBy({ project_id: project_id });
            if (!project) {
                console.log("Not found");
                throw new NotFoundException(`Project not found`);
            }

            this.ProjectRepository.delete(project_id);

            return {
                message: `Project Id ${project_id} is deleted successfully`
            };
        }
        catch (err) {
            if (err) {
                throw new err;
            }
            throw new InternalServerErrorException(`Unexpected error while deleting project by id: ${err}`);
        }
    }

    async findAllProjects(): Promise<{ projects: ProjectEntity[] }> {
        try {
            const projects = await this.ProjectRepository.find();
            return { projects: projects };
        }
        catch (err) {
            if (err) {
                throw new err;
            }
            throw new InternalServerErrorException(`Unexpected error while deleting project by id: ${err}`);
        }
    }

}
