import { CreatePlanningDto } from "../../planning/dto/planning.dto"
import { Risk } from "../../work-items/enum/work-items-enum"

export const mockPlanningDto: CreatePlanningDto = {
    priority: 1,
    storypoint: 1,
    risk: Risk.Low,
    effort: 1,
    businessvalue: 1,
    timecriticality: 1,
    startdate: new Date('2020-02-02'),
    targetdate: new Date('2020-02-02'),

}
