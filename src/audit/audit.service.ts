import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLog } from './entities/audit-log.entity';
import { FindAuditLogsDto } from './dto/find-audit-logs.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async findAll(dto: FindAuditLogsDto) {
    const {
      action,
      entity,
      userId,
      entityId,
      startDate,
      endDate,
      requestId,
      page = 1,
      limit = 20,
    } = dto;

    const query = this.auditRepository.createQueryBuilder('audit');

    if (action) {
      query.andWhere('audit.action = :action', { action });
    }

    if (entity) {
      query.andWhere('audit.entity = :entity', { entity });
    }

    if (userId) {
      query.andWhere('audit.user_id = :userId', { userId });
    }

    if (entityId) {
      query.andWhere('audit.entity_id = :entityId', { entityId });
    }

    if (startDate) {
      query.andWhere('audit.created_at >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      const end = new Date(endDate);

      if (endDate.length === 10) {
        end.setHours(23, 59, 59, 999);
      }

      query.andWhere('audit.created_at <= :endDate', {
        endDate: end,
      });
    }

    if (requestId) {
      query.andWhere('audit.request_id = :requestId', { requestId });
    }

    query
      .orderBy('audit.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return this.auditRepository.findOne({
      where: { id },
    });
  }
}
