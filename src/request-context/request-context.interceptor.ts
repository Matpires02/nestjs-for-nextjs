import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContextService } from './request-context.service';
import { AuthenticatedRequest } from 'src/auth/types/autenticated-request';
import { RequestWithId } from './types/request-with-id.type';
type RequestWithUser = AuthenticatedRequest & RequestWithId;

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
