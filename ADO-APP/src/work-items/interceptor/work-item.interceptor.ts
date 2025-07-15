import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WorkItem } from "../work-items.entity";

@Injectable()
export class WorkItemTransformInterceptor implements NestInterceptor {

    intercept(
        context: ExecutionContext,
        next: CallHandler<WorkItem | WorkItem[]>):
        Observable<WorkItem | WorkItem[]> | Promise<Observable<WorkItem | WorkItem[]>> {
        return next.handle().pipe(
            map((data: WorkItem | WorkItem[]) => {
                return this.filterFields(data);
            }),
        );
    }

    private filterFields(item: WorkItem | WorkItem[]): WorkItem | WorkItem[] {
        if (Array.isArray(item)) {
            return item.map(i => this.filterFields(i) as WorkItem);
        }
        switch (item.type) {
            case 'Epic':
            case 'Bug':
            case 'Feature':
            case 'UserStory':
            case 'Task':
                if (item?.planning) {
                    item.planning.priority = item.planning.priority;
                }
        }
        return item;
    }

}


