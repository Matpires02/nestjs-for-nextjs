import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PageResponse } from 'src/common/dto/page-response';
import { AuditLogDTO } from './dto/audit.dto';
import { FindAuditLogsDto } from './dto/find-audit-logs.dto';

export function ApiAuditQuery(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Get all audit logs with optional filters',
      description:
        'Retrieve a list of audit logs with optional filters for userId, action, and date range.',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiQuery({
      name: 'query',
      description: 'Audit log filter parameters',
      required: false,
      type: FindAuditLogsDto,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: PageResponse<AuditLogDTO>,
      isArray: false,
      description: 'Paginated list of audit logs',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiAuditLogById(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiParam({
      name: 'id',
      description: 'audit log ID',
      required: true,
      type: String,
    })(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Get audit log by ID',
      description: 'Retrieve a specific audit log by its unique identifier.',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      type: AuditLogDTO,
      isArray: false,
      description: 'Audit log',
    })(target, propertyKey, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 401, description: 'Unauthorized.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}
