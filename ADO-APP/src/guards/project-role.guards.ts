// project-roles.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../src/custom-decorators/roles.decorator';
import { DataSource } from 'typeorm';
import { ProjectMemberEntity } from '../tables/project-member/project-member.entity';

@Injectable()
export class ProjectRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private dataSource: DataSource
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        console.log("Guard about to activate");
        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const projectId = +request.params.id; // assumes :projectId in route

        const repo = this.dataSource.getRepository(ProjectMemberEntity);
        const membership = await repo.findOne({
            where: {
                user: { id: user.userId },
                project: { project_id: projectId },
            },
        });
        console.log(membership);

        if (!membership) throw new ForbiddenException('User not part of project');

        if (!requiredRoles.includes(membership.role)) {
            throw new ForbiddenException('Insufficient role for this project');
        }

        return true;
    }
}

