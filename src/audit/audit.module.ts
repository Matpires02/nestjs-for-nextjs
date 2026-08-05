import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditSubscriber } from './audit.subscriber';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditSubscriber, AuditService],
  controllers: [AuditController],
  exports: [TypeOrmModule],
})
export class AuditModule {}
