import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextData {
  userId: string | null;
  ip: string | null;
  method: string | null;
  route: string | null;
  userAgent: string | null;
  requestId: string | null;
}

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextData>();

  run(context: RequestContextData, callback: () => void): void {
    this.storage.run(context, callback);
  }

  get(): RequestContextData | undefined {
    return this.storage.getStore();
  }

  setUserId(userId: string | null): void {
    const context = this.storage.getStore();

    if (context) {
      context.userId = userId;
    }
  }

  setRequestId(requestId: string | undefined): void {
    const context = this.storage.getStore();

    if (context) {
      context.requestId = requestId ?? null;
    }
  }
}
