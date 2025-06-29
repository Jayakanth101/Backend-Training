import { ProjectEntity } from "../../tables/project/project.entity"
import { mockUser } from "./mock.user.data"

export const mockProject: ProjectEntity = {
    project_id: 1,
    project_description: "First project",
    project_name: "Main project",
    sprints: [],
    work_items: [],
    project_creator: mockUser,
    members: []
}
