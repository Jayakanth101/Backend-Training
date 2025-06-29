import { MembersProjectResponseDto } from "../../tables/project-member/dto/members-project-response.dto";
import { mockProject } from "../data/mock.project.data";

export const mockMembersProjectResponseDto: MembersProjectResponseDto = {
    project_id: mockProject.project_id,
    project_name: mockProject.project_name
}
