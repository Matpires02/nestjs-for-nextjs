import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { createHash } from 'crypto';
import { RefreshToken } from './entity/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async create(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const tokenHash = this.hashToken(token);

    const refreshToken = this.refreshTokenRepository.create({
      userId,
      tokenHash,
      expiresAt,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async findValidToken(token: string) {
    const tokenHash = this.hashToken(token);

    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        tokenHash,
      },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshToken.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshToken.expiresAt <= new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    return refreshToken;
  }

  async revoke(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);

    await this.refreshTokenRepository.update(
      {
        tokenHash,
      },
      {
        revokedAt: new Date(),
      },
    );
  }

  async revokeAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      [
        {
          userId,
        },
        { revokedAt: IsNull() },
      ],
      {
        revokedAt: new Date(),
      },
    );
  }
}
