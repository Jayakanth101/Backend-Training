import { CreateWorkItemDto } from "./create-work-item-dto"
import { PartialType } from "@nestjs/mapped-types"
import { Type as TransformType } from "class-transformer"
import { CreatePlanningDto } from "../../planning/dto/planning.dto"

export class UpdateWorkItemDto extends PartialType(CreateWorkItemDto) {
    @TransformType(() => CreatePlanningDto)
    planning?: CreatePlanningDto | null;
}
