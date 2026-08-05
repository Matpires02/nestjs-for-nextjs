import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { RequestWithId } from './types/request-with-id.type';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const response = context.switchToHttp().getResponse();

    const requestId =
      request.headers['x-request-id']?.toString() ?? randomUUID();

    request.requestId = requestId;

    response.setHeader('X-Request-ID', requestId);

    return next.handle();
  }
}
