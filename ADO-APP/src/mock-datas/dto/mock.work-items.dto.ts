import { WorkItem } from "../../work-items/work-items.entity"
import { Type } from "../../work-items/enum/work-items-enum"
import { State } from "../../work-items/enum/work-items-enum"
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
}]
