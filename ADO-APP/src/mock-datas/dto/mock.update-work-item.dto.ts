import { UpdateWorkItemDto } from "../../work-items/dto/update-work-item-dto"
import { Type } from "../../work-items/enum/work-items-enum"
import { State } from "../../work-items/enum/work-items-enum"

export const mockUpdateWorkItemDto: UpdateWorkItemDto = {
    type: Type.Epic,
    title: "First Workitem and it is updated",
    state: State.New,
    created_by: 1,
    description: "Sample workitem and it is updted description",
    activity_date: new Date(''),
    area_path: "ado",
    iteration: "ado",
    assigned_to: 1,
    parentid: null,
    classification: "business",
    planning: null,
}
