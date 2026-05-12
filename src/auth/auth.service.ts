import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    //console.log(body);
    //return 'Olá do Auth service!';
    return loginDto;
  }
}
