import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './attachments.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class AttachmentService {
    constructor(
        @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
        @InjectQueue('attachment') private attachmentQueue: Queue,
    ) { }

    async saveAndQueue(file: Express.Multer.File, workItemId: number, userId: number) {

        const attachment = this.attachmentRepo.create({
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            workItemId: workItemId,
            uploadedById: userId,
        });
        const saved = await this.attachmentRepo.save(attachment);

        await this.attachmentQueue.add('handle-upload', {
            attachmentId: saved.id,
            filePath: file.path,
        });

        return saved;
    }

    async markAsProcessed(id: number) {
        if (!id) throw new Error('Attachment ID is missing');
        await this.attachmentRepo.update(id, { status: 'done' });
    }
}

