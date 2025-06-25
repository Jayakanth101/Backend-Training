import { Planning } from "src/planning/planning.entity"
import { mockWorkitem } from "./mock.work-item.data"
import { Risk } from "src/work-items/enum/work-items-enum"

export const mockPlanning: Planning = {
    planning_id: 1,
    work_item: mockWorkitem,
    priority: 1,
    story_point: 1,
    risk: Risk.Low,
    effort: 1,
    business_value: 1,
    time_criticality: 1,
    start_date: new Date(''),
    target_date: new Date(''),
}
