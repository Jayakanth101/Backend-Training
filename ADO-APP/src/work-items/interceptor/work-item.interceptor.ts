import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class WorkItemTransformInterceptor implements NestInterceptor {

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>):
        Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
                return this.filterFields(data);
            }),
        );
    }

    private filterFields(item: any) {
        switch (item.type) {
            case 'Epic':
            case 'Bug':
            case 'Feature':
            case 'UserStor':
            case 'Task':
                if (item?.planning) {
                    item.planning = {
                        priority: item.planning.priority,
                    };
                }
        }
        return item;
    }

}


