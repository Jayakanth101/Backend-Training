import { mockUser } from "./mock.user.data"
import { mockProject } from "./mock.project.data"

export const mockProjectMembers = [
    {
        id: 1,
        user: mockUser,
        project: mockProject,
        role: "admin",
        assignedWorkItems: []
    }
]
