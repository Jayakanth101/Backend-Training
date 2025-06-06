import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Planning } from './planning.entity';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { WorkItem } from 'src/work-items/work-items.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Planning, WorkItem])],
    controllers: [PlanningController],
    providers: [PlanningService],
    exports: [TypeOrmModule],
})

export class PlanningModule { }
