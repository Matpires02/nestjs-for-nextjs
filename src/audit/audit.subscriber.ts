import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditAction } from './entities/audit-log.entity';
import { AuditLog } from './entities/audit-log.entity';
import { RequestContextService } from 'src/request-context/request-context.service';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(
    private readonly dataSource: DataSource,
    private readonly requestContext: RequestContextService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Object;
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    if (event.metadata.target === AuditLog) {
      return;
    }

    const entity = event.entity;

    if (!entity) {
      return;
    }

    await this.createAuditLog(event, AuditAction.CREATE, null, entity);
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    if (event.metadata.target === AuditLog) {
      return;
    }

    const entity = event.entity;

    if (!entity) {
      return;
    }

    await this.createAuditLog(
      event,
      AuditAction.UPDATE,
      event.databaseEntity ?? null,
      entity,
    );
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (event.metadata.target === AuditLog) {
      return;
    }

    const entity = event.databaseEntity;

    if (!entity) {
      return;
    }

    await this.createAuditLog(event, AuditAction.DELETE, entity, null);
  }

  private async createAuditLog(
    event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>,
    action: AuditAction,
    oldValues: Record<string, unknown> | null,
    newValues: Record<string, unknown> | null,
  ): Promise<void> {
    const context = this.requestContext.get();

    const entityId = newValues?.id ?? oldValues?.id ?? null;

    const sanitizedOldValues = this.sanitize(oldValues);

    const sanitizedNewValues = this.sanitize(newValues);

    const auditLog = event.manager.create(AuditLog, {
      userId: context?.userId ?? null,

      action,

      entity: event.metadata.name,

      entityId: entityId !== null ? String(entityId) : null,

      oldValues: sanitizedOldValues,

      newValues: sanitizedNewValues,

      method: context?.method ?? null,

      route: context?.route ?? null,

      ip: context?.ip ?? null,

      userAgent: context?.userAgent ?? null,
    });

    await event.manager.save(AuditLog, auditLog);
  }

  private sanitize(
    entity: Record<string, unknown> | null,
  ): Record<string, unknown> | null {
    if (!entity) {
      return null;
    }

    const sanitized = {
      ...entity,
    };

    const sensitiveFields = [
      'password',
      'passwordHash',
      'refreshToken',
      'accessToken',
      'resetToken',
    ];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
