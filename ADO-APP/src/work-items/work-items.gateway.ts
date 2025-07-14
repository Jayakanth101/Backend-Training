import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io"
import { WorkItem } from "./work-items.entity";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WorkItemsGateway {
    @WebSocketServer()
    server: Server;


    onWorkItemCreated(workItem: WorkItem) {
        this.server.emit("workItemCreated", workItem);
    }

    onWorkItemUpdated(workItem: WorkItem) {
        this.server.emit("workItemUpdated", workItem);
    }
}
