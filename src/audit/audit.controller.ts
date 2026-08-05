import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { FindAuditLogsDto } from './dto/find-audit-logs.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Query() query: FindAuditLogsDto) {
    return this.auditService.findAll(query);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    const audit = await this.auditService.findById(id);

    if (!audit) {
      throw new NotFoundException('Audit log not found');
    }

    return audit;
  }
}
