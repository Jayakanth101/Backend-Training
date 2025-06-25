import { SprintEntity } from "src/tables/sprints/sprints.entity"
import { mockProject } from "./mock.project.data"

export const mockSprint: SprintEntity = {
    id: 1,
    project: mockProject,
    project_id: 1,
    workitems: [],
    sprint_name: "First sprint",
    start_date: new Date(''),
    end_date: new Date(''),
    location: "ado",
}
