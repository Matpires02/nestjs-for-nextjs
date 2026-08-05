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
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import type { StringValue } from 'ms';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly requestContext: RequestContextService,
    private readonly auditService: AuditService,
    private readonly refreshTokenService: RefreshTokenService,
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

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    const expiresAt = new Date(
      Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN as StringValue),
    );

    await this.refreshTokenService.create(user.id, refreshToken, expiresAt);

    user.forceLogout = false;
    await this.userService.save(user);

    await this.createAuditLog(AuditAction.LOGIN, AuditStatus.SUCCESS, user.id);

    return { accessToken, refreshToken };
  }

  async logout() {}

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const storedToken =
      await this.refreshTokenService.findValidToken(refreshToken);

    let payload: { sub: string; type: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh' || payload.sub !== storedToken.userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findById(payload.sub);

    if (!user || user.forceLogout) {
      throw new UnauthorizedException('Invalid authentication');
    }

    await this.refreshTokenService.revoke(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } =
      await this.createTokens(user.id, user.email);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private async createTokens(id: string, email: string) {
    const jwtPayload: JwtPayload = {
      sub: id,
      email: email,
      type: 'access',
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || '15m',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: id,
        email: email,
        type: 'refresh',
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as StringValue) || '7d',
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      },
    );

    return { accessToken, refreshToken };
  }

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
