import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProjectMemberEntity } from "./project-member.entity";
import { ProjectMemberDto } from "./dto/project-member.dto";
import { ProjectMemberResponseDto } from "./dto/project-member-response.dtp";
import { MembersProjectResponseDto } from "./dto/members-project-response.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProjectMemberService {
    constructor(
        @InjectRepository(ProjectMemberEntity)
        private readonly repo: Repository<ProjectMemberEntity>) { }


    async createProjectMember(memberDto: ProjectMemberDto): Promise<string> {
        const result = this.repo.create(memberDto);
        await this.repo.save(result);

        return `User ${memberDto.user_id} added as a ${memberDto.role} to the project ${memberDto.project_id}`;
    }

    async getAllProjectMembers(projectId: number): Promise<ProjectMemberResponseDto[]> {
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

    async updateProjectMembership(projectId: number, userId: number, role: string):
        Promise<ProjectMemberDto> {
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

        member.role = role;
        const updatedMember = await this.repo.save(member);

        return {
            user_id: updatedMember.user.id,
            project_id: updatedMember.project.project_id,
            role: updatedMember.role,
        }

    }

    async removeProjectMembership(projectId: number, userId: number): Promise<string> {
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
