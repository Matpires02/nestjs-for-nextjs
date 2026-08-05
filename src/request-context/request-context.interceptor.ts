import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContextService } from './request-context.service';
import { RequestWithUser } from './types/request-with-user-and-id.type';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(private readonly requestContext: RequestContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.id) {
      this.requestContext.setUserId(user.id);
    }

    this.requestContext.setRequestId(request.requestId);

    return next.handle();
  }
}
