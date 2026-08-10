import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiAuthLogin } from './auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiAuthLogin()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
