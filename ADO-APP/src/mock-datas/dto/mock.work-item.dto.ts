import { CreateWorkItemDto } from "src/work-items/dto/create-work-item-dto"
import { Type } from "src/work-items/enum/work-items-enum"
import { State } from "src/work-items/enum/work-items-enum"

export const mockWorkItemDto: CreateWorkItemDto = {
    type: Type.Epic,
    title: "First Workitem",
    state: State.New,
    createdby: 1,
    description: "Sample workitem",
    activity_date: new Date(''),
    area_path: "ado",
    iteration: "ado",
    assigned_to: 1,
    parentid: null,
    classification: "business",
    planning: null,
}
