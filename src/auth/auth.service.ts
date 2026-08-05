import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { HashingService } from 'src/common/hashing/hasing.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';
import { RequestContextService } from 'src/request-context/request-context.service';
import { AuditAction } from 'src/audit/entities/audit-log.entity';
import { AuditStatus } from 'src/audit/entities/audit-status.enum';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly requestContext: RequestContextService,
    private readonly auditService: AuditService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      await this.createAuditLog(AuditAction.LOGIN, AuditStatus.FAILURE, null);
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const isPasswordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      await this.createAuditLog(
        AuditAction.LOGIN,
        AuditStatus.FAILURE,
        user.id,
      );
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(jwtPayload);

    user.forceLogout = false;
    await this.userService.save(user);

    await this.createAuditLog(AuditAction.LOGIN, AuditStatus.SUCCESS, user.id);

    return { accessToken };
  }

  async logout() {}

  private async createAuditLog(
    action: AuditAction,
    status: AuditStatus,
    userId: string | null = null,
  ) {
    const requestContext = this.requestContext.get();

    await this.auditService.create({
      action,
      status,
      userId,
      entity: 'Auth',
      entityId: null,
      requestId: requestContext?.requestId ?? null,
      oldValues: null,
      newValues: null,
      method: requestContext?.method ?? 'POST',
      route: requestContext?.route ?? '/auth/login',
      ip: requestContext?.ip ?? null,
      userAgent: requestContext?.userAgent ?? null,
    });
  }
}
