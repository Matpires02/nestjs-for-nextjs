import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int-pipe.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/autenticated-request';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', CustomParseIntPipe) id: number,
  ) {
    console.log('User: ', req.user);
    return `This action returns a user #${id}`;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateUserDto, @Req() req: AuthenticatedRequest) {
    return this.userService.update(req.user.id, dto);
  }
}
