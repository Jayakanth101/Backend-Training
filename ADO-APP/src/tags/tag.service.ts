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

    async createTag(dto: CreateTagDto): Promise<Tags> {
        const newTag = this.TagRepo.create(dto);
        return await this.TagRepo.save(newTag);
    }

    async deleteTag(id: number): Promise<string> {
        const existing = await this.TagRepo.findOneBy({ id });
        if (!existing) {
            throw new NotFoundException(`Tag with id ${id} not found`);
        }
        await this.TagRepo.delete(id);
        return `Tag ${id} is deleted`;
    }

    async getAllTags(workItemId: number): Promise<Tags[]> {
        return await this.TagRepo.createQueryBuilder('tag')
            .leftJoin('tag.workitems', 'workitem')
            .where('workitem.id = :workItemId', { workItemId })
            .getMany();
    }

}
