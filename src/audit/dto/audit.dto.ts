import { ApiProperty } from '@nestjs/swagger';
import { AuditAction } from '../entities/audit-log.entity';
import { AuditStatus } from '../entities/audit-status.enum';

export class AuditLogDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string | null;

  @ApiProperty()
  action: AuditAction;

  @ApiProperty()
  entity: string;

  @ApiProperty({ type: String })
  entityId: string | null;

  @ApiProperty()
  oldValues: Record<string, unknown> | null;

  @ApiProperty()
  newValues: Record<string, unknown> | null;

  @ApiProperty({ type: String })
  method: string | null;

  @ApiProperty({ type: String })
  route: string | null;

  @ApiProperty({ type: String })
  ip: string | null;

  @ApiProperty({ type: String })
  userAgent: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: String })
  requestId: string | null;

  @ApiProperty({ enum: AuditStatus })
  status: AuditStatus;
}
