import { Global, Module } from '@nestjs/common';

import { RequestContextService } from './request-context.service';
import { RequestContextInterceptor } from './request-context.interceptor';
import { RequestIdInterceptor } from './request-id.interceptor';

@Global()
@Module({
  providers: [
    RequestContextService,
    RequestContextInterceptor,
    RequestIdInterceptor,
  ],
  exports: [
    RequestContextService,
    RequestContextInterceptor,
    RequestIdInterceptor,
  ],
})
export class RequestContextModule {}
