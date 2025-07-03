import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException,
} from "@nestjs/common";
import { ProjectEntity } from "./project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectEntityDto } from "./dto/project.dto";
import { ProjectUpdateDto } from "./dto/project-update.dto";
import { User } from "../../users/users.entity";

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
            const user = await this.UserRepository.findOneBy({ id: dto.project_creator_id });
            if (!user) {
                throw new NotFoundException(`User not found`);
            }

            const project = this.ProjectRepository.create(dto);
            const savedProject = await this.ProjectRepository.save(project);
            return { project: savedProject };
        } catch (err) {
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException(`Unexpected error during project creation`);
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

            return { project };
        } catch (err) {
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException(`Unexpected error while fetching project by id`);
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
                throw new NotFoundException(`Project not found after update`);
            }

            return { project: savedProject, message: "Project updated successfully" };
        } catch (err) {
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException(`Unexpected error while updating project`);
        }
    }

    async deleteProject(project_id: number): Promise<{ message: string }> {
        try {
            const project = await this.ProjectRepository.findOneBy({ project_id });
            if (!project) {
                throw new NotFoundException(`Project not found`);
            }

            await this.ProjectRepository.delete(project_id);

            return {
                message: `Project Id ${project_id} is deleted successfully`
            };
        } catch (err) {
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException(`Unexpected error while deleting project`);
        }
    }

    async findAllProjects(): Promise<{ projects: ProjectEntity[] }> {
        try {
            const projects = await this.ProjectRepository.find();
            return { projects };
        } catch (err) {
            throw new InternalServerErrorException(`Unexpected error while fetching all projects`);
        }
    }
}

