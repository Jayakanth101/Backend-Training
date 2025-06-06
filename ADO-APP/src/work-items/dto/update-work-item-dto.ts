import { CreateWorkItemDto } from "./create-work-item-dto"
import { PartialType } from "@nestjs/mapped-types"

export class UpdateWorkItemDto extends PartialType(CreateWorkItemDto) { }
