import { WorkItem } from "../../work-items/work-items.entity"
import { Type } from "../../work-items/enum/work-items-enum"
import { mockProject } from "./mock.project.data"
import { mockUser } from "./mock.user.data"
import { mockSprint } from "./mock.sprint.data"
import { mockProjectMemberEntity } from "./mock.project-member.data"
import { State } from "../../work-items/enum/work-items-enum"

export const mockWorkitem: WorkItem = {
    id: 1,
    type: Type.Epic,
    title: "First Workitem",
    state: State.New,
    created_by: mockUser,
    description: "Sample workitem",
    activity_date: new Date('2025-02-02'),
    area_path: "ado",
    iteration: "ado",
    assignedTo: mockProjectMemberEntity,
    sprint_id: 1,
    updated_at: new Date('2025-02-02'),
    created_at: new Date('2025-02-02'),
    completed_at: new Date('2025-02-02'),
    discussion: [],
    tags: [],
    childrens: [],
    sprint: mockSprint,
    project: mockProject,
    parent: null,
    classification: "business",
    planning: null
}
