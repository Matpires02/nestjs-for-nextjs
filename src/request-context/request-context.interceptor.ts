import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { RequestContextService } from './request-context.service';
import { AuthenticatedRequest } from 'src/auth/types/autenticated-request';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(private readonly requestContext: RequestContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    const user = request.user;

    if (user?.id) {
      this.requestContext.setUserId(user.id);
    }

    return next.handle();
  }
}
