import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tags } from "./tag.entity";
import { CreateTagDto } from "./dto/create-tag-dto";
import { WorkItem } from "../../src/work-items/work-items.entity";
import { UpdateTagDto } from "./dto/update-tag-dto";


@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tags)
        private tagRepo: Repository<Tags>,
        @InjectRepository(WorkItem)
        private workItemRepo: Repository<WorkItem>
    ) { }

    async createTag(dto: CreateTagDto): Promise<{ Tags: Tags, Message: string }> {
        try {
            const newTag = this.tagRepo.create(dto);
            const savedTag = await this.tagRepo.save(newTag);
            return { Tags: savedTag, Message: `Tag: ${dto.tagname} created successfully` };
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException(`Tag with name "${dto.tagname}" already exists`);
            }
            throw new InternalServerErrorException(`Unexpected error while creating tag ${error}`);
        }
    }


    async getAllTags(workItemId: number): Promise<{ Tags: Tags[] }> {
        const existing = await this.workItemRepo.findOneBy({ id: workItemId });
        if (!existing) {
            throw new NotFoundException(`Work item ID ${workItemId} not found`);
        }
        const tags = await this.tagRepo.createQueryBuilder('tag')
            .leftJoin('tag.workitems', 'workitem')
            .where('workitem.id = :workItemId', { workItemId })
            .getMany();
        return { Tags: tags };
    }

    async updateTag(id: number, dto: UpdateTagDto): Promise<{ Tag: Tags, Message: string }> {
        const existing = await this.tagRepo.findOne({
            where: { id },
            relations: ['workitems'],
        });

        if (!existing) {
            throw new NotFoundException(`Tag with id ${id} not found`);
        }

        const workItemIds = dto.workitem_ids ?? [];
        const workItems: WorkItem[] = [];

        for (const wid of workItemIds) {
            const item = await this.workItemRepo.findOneBy({ id: wid });
            if (!item) {
                throw new NotFoundException(`Work item id ${wid} not found`);
            }
            workItems.push(item);
        }

        existing.workitems = workItems;

        const updated = await this.tagRepo.save(existing);

        return {
            Tag: updated,
            Message: `Work items tagged to Tag ID ${id}`,
        };
    }

    async removeTagFromWorkItem(tagId: number, workItemId: number): Promise<{ message: string }> {
        const tag = await this.tagRepo.findOne({
            where: { id: tagId },
            relations: ['workitems'],
        });

        if (!tag) {
            throw new NotFoundException(`Tag with id ${tagId} not found`);
        }

        tag.workitems = tag.workitems.filter(wi => wi.id !== workItemId);

        await this.tagRepo.save(tag);

        return { message: `Tag ${tagId} removed from WorkItem ${workItemId}` };
    }
}
