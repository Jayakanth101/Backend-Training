import { UpdateWorkItemDto } from "src/work-items/dto/update-work-item-dto"
import { Type } from "src/work-items/enum/work-items-enum"
import { State } from "src/work-items/enum/work-items-enum"

export const mockUpdateWorkItemDto: UpdateWorkItemDto = {
    type: Type.Epic,
    title: "First Workitem and it is updated",
    state: State.New,
    createdby: 1,
    description: "Sample workitem and it is updted description",
    activity_date: new Date(''),
    area_path: "ado",
    iteration: "ado",
    assigned_to: 1,
    parentid: null,
    classification: "business",
    planning: null,
}
