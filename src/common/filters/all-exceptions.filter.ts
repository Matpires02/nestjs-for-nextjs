import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuditService } from 'src/audit/audit.service';
import { AuditAction } from 'src/audit/entities/audit-log.entity';
import { AuditStatus } from 'src/audit/entities/audit-status.enum';
import { RequestContextService } from 'src/request-context/request-context.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly requestContext: RequestContextService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const defaultError = 'Internal server Error';
    const defaultMessage = 'Internal server Error';

    let messages: string[] = [defaultMessage];
    let errorName = defaultError;

    if (isHttpException) {
      const responseData = exception.getResponse();
      if (typeof responseData === 'string') {
        messages = [responseData];
      }
      if (typeof responseData === 'object' && responseData != null) {
        const { message, error } = responseData as Record<string, any>;
        if (Array.isArray(message)) {
          messages = message as string[];
        } else if (typeof message === 'string') {
          messages = [message];
        }

        if (typeof error === 'string') {
          errorName = error;
        }
      }
    }

    if (!isHttpException) {
      this.logger.error(
        `Erro interno inesperado`,
        (exception as Error).stack || 'sem stack',
      );
    } else {
      this.logger.warn(`${status} - ${errorName}: ${messages.join(' | ')}`);
    }

    /*
     * Auditoria
     */
    await this.auditFailure(request, status, messages);

    return response.status(status).json({
      message: messages,
      error: errorName,
      statusCode: status,
    });
  }

  private async auditFailure(
    request: Request,
    status: number,
    messages: string[],
  ): Promise<void> {
    const method = request.method.toUpperCase();

    const isAccessDenied = status === 401 || status === 403;

    const isDataMutation =
      method === 'POST' ||
      method === 'PUT' ||
      method === 'PATCH' ||
      method === 'DELETE';

    if (!isAccessDenied && !isDataMutation) {
      return;
    }

    const context = this.requestContext.get();

    try {
      await this.auditService.create({
        action: isAccessDenied
          ? AuditAction.ACCESS_DENIED
          : this.getAuditAction(method),

        entity: isAccessDenied
          ? 'Authorization'
          : this.getEntityFromRoute(request),

        entityId: isAccessDenied ? null : this.getEntityIdFromRoute(request),

        status: AuditStatus.FAILURE,

        oldValues: null,

        newValues: {
          statusCode: status,
          messages,
        },

        userId: context?.userId ?? null,

        requestId: context?.requestId ?? null,

        method: context?.method ?? request.method,

        route: context?.route ?? request.originalUrl,

        ip: context?.ip ?? request.ip ?? null,

        userAgent: context?.userAgent ?? request.get('user-agent') ?? null,
      });
    } catch (auditError) {
      /*
       * Falha na auditoria não pode impedir
       * que o erro original seja retornado.
       */
      this.logger.error(
        'Erro ao registrar auditoria da exceção',
        auditError instanceof Error ? auditError.stack : String(auditError),
      );
    }
  }

  private getAuditAction(method: string): AuditAction {
    switch (method) {
      case 'POST':
        return AuditAction.CREATE;

      case 'PUT':
      case 'PATCH':
        return AuditAction.UPDATE;

      case 'DELETE':
        return AuditAction.DELETE;

      default:
        return AuditAction.UPDATE;
    }
  }

  private getEntityFromRoute(request: Request): string {
    const segments = request.path.split('/').filter(Boolean);

    return segments[0] ?? 'Unknown';
  }

  private getEntityIdFromRoute(request: Request): string | null {
    const segments = request.path.split('/').filter(Boolean);
    return segments[1] ?? null;
  }
}
