import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { AttachmentService } from './attachments.service';

@Processor('attachment')
export class AttachmentProcessor {
    constructor(private readonly attachmentService: AttachmentService) { }

    @Process('handle-upload')
    async handleAttachment(job: Job) {
        const { attachmentId, filePath } = job.data;

        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!attachmentId) throw new Error('Missing attachment ID');
        await this.attachmentService.markAsProcessed(attachmentId);
    }
}
