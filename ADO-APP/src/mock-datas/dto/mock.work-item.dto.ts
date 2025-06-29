import { CreateWorkItemDto } from "../../work-items/dto/create-work-item-dto"
import { Type } from "../../work-items/enum/work-items-enum"
import { State } from "../../work-items/enum/work-items-enum"

export const mockWorkItemDto: CreateWorkItemDto = {
    type: Type.Epic,
    title: "First Workitem",
    state: State.New,
    project_id: 1,
    created_by: 1,
    description: "Sample workitem",
    activity_date: new Date('2025-02-02'),
    area_path: "ado",
    udpated_at: new Date("2025-02-02"),
    created_at: new Date("2025-02-02"),
    completed_at: new Date("2025-02-02"),
    assigned_to: 1,
    iteration: "ado",
    parentid: null,
    classification: "business",
    planning: null,
}
