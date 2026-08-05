import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { REFRESH_TOKEN_COOKIE } from './constants/auth.constants';
import ms, { StringValue } from 'ms';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    this.createCookie(response, result.refreshToken);

    return result;
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Body('refreshToken') bodyRefreshToken: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookieRefreshToken = (
      request.cookies as Record<string, string | undefined> | undefined
    )?.refresh_token;

    const refreshToken: string = (cookieRefreshToken ??
      bodyRefreshToken) as string;

    const isWeb = Boolean(cookieRefreshToken);
    const result = await this.authService.refresh(refreshToken);

    if (isWeb) {
      this.createCookie(response, result.refreshToken);

      return {
        accessToken: result.accessToken,
      };
    }
    return result;
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  private getRefreshTokenMaxAge(): number {
    return ms(process.env.JWT_REFRESH_EXPIRES_IN as StringValue);
  }

  private createCookie(response: Response, refreshToken: string) {
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.AUTH_COOKIE_SECURE === '1',
      sameSite: 'lax',
      path: '/auth',
      maxAge: this.getRefreshTokenMaxAge(),
    });
  }
}
