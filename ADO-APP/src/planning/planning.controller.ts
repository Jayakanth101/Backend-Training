import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { PlanningService } from "./planning.service";
import { CreatePlanningDto } from "./dto/planning.dto";

@Controller('planning')
export class PlanningController {
    constructor(
        private readonly planningService: PlanningService
    ) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async Create(@Body() createPlanningDto: CreatePlanningDto): Promise<string> {
        await this.planningService.create(createPlanningDto);
        return `Planning has been created`;
    }
}
