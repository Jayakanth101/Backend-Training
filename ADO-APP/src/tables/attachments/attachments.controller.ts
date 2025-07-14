import { Controller, Post, UploadedFile, UseInterceptors, Req, Body, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentService } from './attachments.service';

@Controller('attachments')
export class AttachmentController {
    constructor(private readonly attachmentService: AttachmentService) { }

    @Post('upload/:workItemId')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads', }))
    async uploadAttachment(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @Param('workItemId') workItemId: number,
    ) {
        const userId = req.user?.id || 1;
        const saved = await this.attachmentService.saveAndQueue(file, workItemId, userId);
        return { message: 'Upload received. Processing in background.', attachment: saved };
    }
}

