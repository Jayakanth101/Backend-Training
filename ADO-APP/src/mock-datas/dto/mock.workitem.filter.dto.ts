import { WorkItemFilterDto } from "src/work-items/dto/work-item-filter.dto";
import { State, Type } from "src/work-items/enum/work-items-enum";
export const mockWorkitemFilterDto: WorkItemFilterDto = {
    id: 1,
    type: Type.Epic,
    assigned_to: 1,
    state: State.New,
    area_path: "ado",
    tags: [],
    recently_updated: false,
    recently_created: false,
    recently_completed: false,
    keyword: null
};
