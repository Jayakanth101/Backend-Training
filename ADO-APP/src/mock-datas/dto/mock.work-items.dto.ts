import { WorkItem } from "src/work-items/work-items.entity"
import { Type } from "src/work-items/enum/work-items-enum"
import { State } from "src/work-items/enum/work-items-enum"
import { mockUser } from "../data/mock.user.data"
import { mockProjectMemberEntity } from "../data/mock.project-member.data"
import { mockSprint } from "../data/mock.sprint.data"
import { mockProject } from "../data/mock.project.data"

export const mockWorkitems: WorkItem[] = [{
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
}]
