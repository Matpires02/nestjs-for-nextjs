import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  RequestContextData,
  RequestContextService,
} from './request-context.service';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContext: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const context: RequestContextData = {
      userId: null,
      ip: req.ip ?? null,
      method: req.method ?? null,
      route: req.originalUrl ?? req.url ?? null,
      userAgent: req.get('user-agent') ?? null,
    };

    this.requestContext.run(context, next);
  }
}
