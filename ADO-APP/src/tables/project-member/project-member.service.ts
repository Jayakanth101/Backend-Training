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


    async createProjectMember(memberDto: ProjectMemberDto): Promise<{ project_member: ProjectMemberEntity }> {

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
        return { project_member: res };
    }

    async getAllProjectMembers(projectId: number): Promise<{ project_members: ProjectMemberResponseDto[] }> {
        const project = await this.projectRepo.findOneBy({ project_id: projectId });
        if (!project) throw new NotFoundException(`Project with id ${projectId} not found`);

        const members = await this.repo.find({
            where: { project: { project_id: projectId } },
            relations: ['user'],
        });
        const member_array = members.map((member) => ({
            user_id: member.user.id,
            user_name: member.user.displayname,
            role: member.role,
        }));

        return { project_members: member_array }
    }

    async getAllMembersProject(userId: number): Promise<{ members_projects: MembersProjectResponseDto[] }> {
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
        const member_array = members.map((member) => ({
            project_id: member.project.project_id,
            project_name: member.project.project_name
        }));

        return { members_projects: member_array }
    }

    async updateProjectMembership(projectId: number, userId: number, roleDto: UpdateProjectMemberRoleDto):
        Promise<{ project_member: ProjectMemberDto }> {

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

        const updatedProjectMember = {
            user_id: updatedMember.user.id,
            project_id: updatedMember.project.project_id,
            role: updatedMember.role,
        }

        return { project_member: updatedProjectMember };

    }

    async removeProjectMembership(projectId: number, userId: number): Promise<{ Message: string }> {
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
        const msg = `Successfully a member ${userId} removed from a project ${projectId}`;
        return { Message: msg };

    }
}
