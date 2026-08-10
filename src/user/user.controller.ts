import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/autenticated-request';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdatePasswordDto } from './dto/update-password';
import {
  ApiUserCreate,
  ApiUserDelete,
  ApiUserGetMe,
  ApiUserPasswordUpdate,
  ApiUserUpdate,
} from './user.swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiUserGetMe()
  async findOne(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.findByOrFail({ id: req.user.id });
    return new UserResponseDto(user);
  }

  @Post()
  @ApiUserCreate()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return new UserResponseDto(user);
  }

  @Patch('me')
  @ApiUserUpdate()
  @UseGuards(JwtAuthGuard)
  async update(@Body() dto: UpdateUserDto, @Req() req: AuthenticatedRequest) {
    const user = await this.userService.update(req.user.id, dto);
    return new UserResponseDto(user);
  }

  @Patch('me/password')
  @ApiUserPasswordUpdate()
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = await this.userService.updatePassword(req.user.id, dto);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiUserDelete()
  @Delete('me')
  async remove(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.remove(req.user.id);
    return new UserResponseDto(user);
  }
}
