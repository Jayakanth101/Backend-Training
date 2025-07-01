import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tags } from "./tag.entity";
import { CreateTagDto } from "./dto/create-tag-dto";
import { WorkItem } from "../../src/work-items/work-items.entity";


@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tags)
        private TagRepo: Repository<Tags>) { }

    async createTag(dto: CreateTagDto): Promise<{ Tags: Tags, Message: string }> {
        const newTag = this.TagRepo.create(dto);
        const savedTag = await this.TagRepo.save(newTag);
        return { Tags: savedTag, Message: `Tag: ${dto.tagname} created successfully` }
    }

    async deleteTag(id: number): Promise<{ Message: string }> {
        const existing = await this.TagRepo.findOneBy({ id });
        if (!existing) {
            throw new NotFoundException(`Tag with id ${id} not found`);
        }
        await this.TagRepo.delete(id);
        return { Message: `Tag ${id} is deleted` };
    }

    async getAllTags(workItemId: number): Promise<{ Tags: Tags[] }> {
        const tags = await this.TagRepo.createQueryBuilder('tag')
            .leftJoin('tag.workitems', 'workitem')
            .where('workitem.id = :workItemId', { workItemId })
            .getMany();
        return { Tags: tags };
    }

}
