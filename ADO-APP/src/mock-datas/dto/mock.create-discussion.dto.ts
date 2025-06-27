import { CreateDiscussionDto } from "src/discussion/dto/create-discussion.dto";
import { mockWorkitem } from "../data/mock.work-item.data";
import { mockUser } from "../data/mock.user.data";

export const mockCreateDiscussionDto: CreateDiscussionDto = {

    commentid: 1,
    workitemid: mockWorkitem.id,
    creatorid: mockUser.id,
    message: "First comment",
    createdat: new Date(''),
}
