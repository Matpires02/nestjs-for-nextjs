import { InternalServerErrorException, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { CommonModule } from 'src/common/common.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuditModule } from 'src/audit/audit.module';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UserModule,
    CommonModule,
    AuditModule,
    RefreshTokenModule,
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new InternalServerErrorException(
            'JWT_SECRET not found in environment variables',
          );
        }

        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!refreshSecret) {
          throw new InternalServerErrorException(
            'JWT_REFRESH_SECRET not found in environment variables',
          );
        }

        const expiresIn: any = process.env.JWT_EXPIRATION || '15m';
        const issuer = process.env.JWT_ISSUER;
        const audience = process.env.JWT_AUDIENCE;

        return {
          secret,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          signOptions: { expiresIn, issuer, audience, algorithm: 'HS256' },
          verifyOptions: { issuer, audience },
        };
      },
    }),
  ],
})
export class AuthModule {}
