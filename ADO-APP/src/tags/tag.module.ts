import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { Tags } from "./tag.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Tags])],
    providers: [TagService],
    controllers: [TagController]
})

export class TagModule { }
