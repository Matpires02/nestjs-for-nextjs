import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { AuditAction } from '../entities/audit-log.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FindAuditLogsDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @ApiProperty()
  @IsOptional()
  @IsString()
  entity?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  requestId?: string;
}
