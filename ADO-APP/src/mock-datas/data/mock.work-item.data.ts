import { WorkItem } from "src/work-items/work-items.entity"
import { Type } from "src/work-items/enum/work-items-enum"
import { mockProject } from "./mock.project.data"
import { mockUser } from "./mock.user.data"
import { mockSprint } from "./mock.sprint.data"
import { mockProjectMemberEntity } from "./mock.project-member.data"
import { State } from "src/work-items/enum/work-items-enum"

export const mockWorkitem: WorkItem = {
    id: 1,
    type: Type.Epic,
    title: "First Workitem",
    state: State.New,
    created_by: mockUser,
    description: "Sample workitem",
    assigned_to: 1,
    activity_date: new Date(''),
    area_path: "ado",
    iteration: "ado",
    assignedTo: mockProjectMemberEntity,
    sprint_id: 1,
    updated_at: new Date(''),
    created_at: new Date(''),
    completed_at: new Date(''),
    discussion: [],
    tags: [],
    childrens: [],
    sprint: mockSprint,
    project: mockProject,
    parent: null,
    classification: "business",
    planning: null
}
