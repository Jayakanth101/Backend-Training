import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Discussion } from "./discussion.entity";
import { CreateDiscussionDto } from "./dto/create-discussion.dto";
import { UpdateDiscussionDto } from "./dto/update-dicussion.dto";
import { WorkItem } from "../work-items/work-items.entity";

import { User } from "../users/users.entity";

@Injectable()
export class DiscussionService {

    constructor(
        @InjectRepository(Discussion)
        private readonly discussionRepository: Repository<Discussion>,

        @InjectRepository(WorkItem)
        private readonly workitemRepository: Repository<WorkItem>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async createComment(createDiscussionDto: CreateDiscussionDto): Promise<Discussion> {
        const workItem = await this.workitemRepository.findOneBy({ id: createDiscussionDto.workitemid });
        if (!workItem) throw new NotFoundException(`WorkItem with id ${createDiscussionDto.workitemid} not found`);

        const creator = await this.userRepo.findOneBy({ id: createDiscussionDto.creatorid });
        if (!creator) throw new NotFoundException(`User with id ${createDiscussionDto.creatorid} not found`);

        console.log("From discussion service: ", workItem.id, creator.id);
        console.log("From discussion service: ", createDiscussionDto.workitemid, createDiscussionDto.creatorid);
        const comment = this.discussionRepository.create({ ...createDiscussionDto, workitem: workItem, creator: creator });
        console.log("Comments form discussion service: ", comment);

        return await this.discussionRepository.save(comment);
    }

    async updateComment(workitemid: number, commentid: number, updateDto: UpdateDiscussionDto): Promise<Discussion> {
        const comment = await this.discussionRepository.findOne({
            where: {
                commentid,
                workitem: { id: workitemid }
            },
        });

        if (!comment) {
            throw new NotFoundException(`Comment ${commentid} not found in WorkItem ${workitemid}`);
        }

        Object.assign(comment, updateDto);
        return await this.discussionRepository.save(comment);
    }

    async findOne(commentid: number): Promise<Discussion> {
        const exist = await this.discussionRepository.findOneBy({ commentid });
        if (!exist) {
            throw new NotFoundException(`Comment with id ${commentid} not found`);
        }
        return exist;
    }

    async findWorkItemDiscussion(workitemid: number): Promise<Discussion[]> {
        console.log("work item id from discussion service: ", workitemid);
        return await this.discussionRepository.find({
            where: { workitem: { id: workitemid } },
            relations: ['creator'],
            order: { createdat: 'ASC' }
        });
    }
}

