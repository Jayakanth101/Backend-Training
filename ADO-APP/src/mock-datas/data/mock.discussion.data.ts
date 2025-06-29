import { Discussion } from "../../discussion/discussion.entity";
import { mockWorkitem } from "./mock.work-item.data";
import { mockUser } from "./mock.user.data";

export const mockDiscussion: Discussion = {
    commentid: 1,
    workitem: mockWorkitem,
    creator: mockUser,
    message: "First comment",
    createdat: new Date(''),
}
