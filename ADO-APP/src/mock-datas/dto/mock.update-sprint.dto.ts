import { UpdateSprintDto } from "../../tables/sprints/dto/update-sprint.dto"
export const mockUpdateSprintDto: UpdateSprintDto = {
    sprint_name: "Sprint 1",
    location: "Paris",
    start_date: new Date('2022-01-01'),
    end_date: new Date('2022-02-02')
}
