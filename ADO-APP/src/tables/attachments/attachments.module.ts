import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Attachment } from './attachments.entity';
import { AttachmentService } from './attachments.service';
import { AttachmentProcessor } from './attachments.process';
import { AttachmentController } from './attachments.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Attachment]),
        BullModule.registerQueue({ name: 'attachment' }),
    ],
    providers: [AttachmentService, AttachmentProcessor],
    controllers: [AttachmentController],
    exports: [AttachmentService],
})
export class AttachmentModule { }

