import { InternalServerErrorException, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { CommonModule } from 'src/common/common.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    CommonModule,
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new InternalServerErrorException(
            'JWT_SECRET not found in environment variables',
          );
        }

        const expiresIn: any = process.env.JWT_EXPIRATION || '1d';

        return {
          secret,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          signOptions: { expiresIn },
        };
      },
    }),
  ],
})
export class AuthModule {}
