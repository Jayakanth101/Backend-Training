import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProjectMemberEntity } from "./project-member.entity";
import { ProjectMemberDto } from "./dto/project-member.dto";
import { ProjectMemberResponseDto } from "./dto/project-member-response.dtp";
import { MembersProjectResponseDto } from "./dto/members-project-response.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../../src/users/users.entity";
import { ProjectEntity } from "../project/project.entity";
import { UpdateProjectMemberRoleDto } from "./dto/project-member-role.dto";

@Injectable()
export class ProjectMemberService {
    constructor(
        @InjectRepository(ProjectMemberEntity)
        private readonly repo: Repository<ProjectMemberEntity>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(ProjectEntity)
        private readonly projectRepo: Repository<ProjectEntity>
    ) { }


    async createProjectMember(memberDto: ProjectMemberDto): Promise<ProjectMemberEntity> {

        const user = await this.userRepo.findOneBy({ id: memberDto.user_id });
        if (!user) throw new NotFoundException(`User with id ${memberDto.user_id} not found`);

        const project = await this.projectRepo.findOneBy({ project_id: memberDto.project_id });
        if (!project) throw new NotFoundException(`Project with id ${memberDto.project_id} not found`);

        const result = this.repo.create({
            user,
            project,
            role: memberDto.role
        });

        const res = await this.repo.save(result);
        return res;
    }

    async getAllProjectMembers(projectId: number): Promise<ProjectMemberResponseDto[]> {
        const project = await this.projectRepo.findOneBy({ project_id: projectId });
        if (!project) throw new NotFoundException(`Project with id ${projectId} not found`);

        const members = await this.repo.find({
            where: { project: { project_id: projectId } },
            relations: ['user'],
        });
        return members.map((member) => ({
            user_id: member.user.id,
            user_name: member.user.displayname,
            role: member.role,
        }));
    }

    async getAllMembersProject(userId: number): Promise<MembersProjectResponseDto[]> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException(`User with id ${userId} not found`);
        const members = await this.repo.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ['project']
        });
        return members.map((member) => ({
            project_id: member.project.project_id,
            project_name: member.project.project_name
        }));
    }

    async updateProjectMembership(projectId: number, userId: number, roleDto: UpdateProjectMemberRoleDto):
        Promise<ProjectMemberDto> {

        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException(`User with id ${userId} not found`);

        const project = await this.projectRepo.findOneBy({ project_id: projectId });
        if (!project) throw new NotFoundException(`Project with id ${projectId} not found`);

        const member = await this.repo.findOne({
            where: {
                project: {
                    project_id: projectId
                },
                user: {
                    id: userId
                }
            }
        });

        if (!member) {
            throw new Error(`No membership found for user ${userId} in project ${projectId}`);
        }

        member.role = roleDto.role;
        member.project = project;
        member.user = user;
        const updatedMember = await this.repo.save(member);

        return {
            user_id: updatedMember.user.id,
            project_id: updatedMember.project.project_id,
            role: updatedMember.role,
        }

    }

    async removeProjectMembership(projectId: number, userId: number): Promise<string> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException(`User with id ${userId} not found`);

        const project = await this.projectRepo.findOneBy({ project_id: projectId });
        if (!project) throw new NotFoundException(`Project with id ${projectId} not found`);

        const member = await this.repo.findOne({
            where: {
                project: {
                    project_id: projectId
                },
                user: {
                    id: userId
                }
            }
        });

        if (!member) {
            throw new Error(`No membership found for user ${userId} in project ${projectId}`);
        }

        await this.repo.remove(member);

        return `Successfully a member ${userId} removed from a project ${projectId}`;
    }
}
