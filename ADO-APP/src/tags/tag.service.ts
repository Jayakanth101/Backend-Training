import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tags } from "./tag.entity";
import { CreateTagDto } from "./dto/create-tag-dto";


@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tags)
        private TagRepo: Repository<Tags>) { }

    async CreateTag(dto: CreateTagDto): Promise<Tags> {
        const newTag = this.TagRepo.create(dto);
        return await this.TagRepo.save(newTag);
    }

    async deleteTag(id: number): Promise<string> {
        const existing = await this.TagRepo.findOneBy({ id });
        if (!existing) {
            throw new NotFoundException(`comment with id ${id} not found`);
        }
        await this.TagRepo.delete(id);
        return `Comment ${id} is deleted`;
    }

}
