import { Attachment } from "../../../src/tables/attachments/attachments.entity";

export const mockAttachment: Attachment = {
    id: 100,
    filename: 'demo.pdf',
    mimetype: 'application/pdf',
    size: 1048576,
    path: '/uploads/demo.pdf',
    status: 'done',
    workItemId: 1,
    uploadedById: 2,
    createdAt: new Date(),
};

