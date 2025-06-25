import { ProjectMemberEntity } from "src/tables/project-member/project-member.entity"
import { mockUser } from "./mock.user.data"
import { mockProject } from "./mock.project.data"

export const mockProjectMemberEntity: ProjectMemberEntity = {
    id: 1,
    user: mockUser,
    project: mockProject,
    role: "admin",
    assignedWorkItems: []
}
