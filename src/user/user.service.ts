import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hasing.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password';
import { AuditService } from 'src/audit/audit.service';
import { AuditAction } from 'src/audit/entities/audit-log.entity';
import { AuditStatus } from 'src/audit/entities/audit-status.enum';
import { RequestContextService } from 'src/request-context/request-context.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly requestContext: RequestContextService,
    private readonly auditService: AuditService,
  ) {}

  async findByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    await this.failIfEmailExists(dto.email);

    const hashedPassword = await this.hashingService.hash(dto.password);

    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    const created = await this.userRepository.save(newUser);
    return created;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  save(user: User) {
    return this.userRepository.save(user);
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!dto.name && !dto.email) {
      throw new BadRequestException('Pelo menos um campo deve ser informado');
    }
    const user = await this.findByOrFail({ id });
    user.name = dto.name ?? user.name;
    if (dto.email && dto.email !== user.email) {
      await this.failIfEmailExists(dto.email);
      user.email = dto.email;
      user.forceLogout = true;
    }

    return this.save(user);
  }

  async failIfEmailExists(email: string) {
    const exists = await this.userRepository.existsBy({
      email,
    });
    if (exists) {
      throw new ConflictException('E-mail já existe');
    }
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findByOrFail({ id });

    const isCurrentPasswordValid = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      await this.createAuditLogForChangePasssword(AuditStatus.FAILURE);
      throw new UnauthorizedException('Senha atual inválida');
    }

    user.password = await this.hashingService.hash(dto.newPassword);
    user.forceLogout = true;
    await this.createAuditLogForChangePasssword(AuditStatus.SUCCESS);
    return this.save(user);
  }

  async remove(id: string) {
    const user = await this.findByOrFail({ id });
    await this.userRepository.delete({ id });
    return user;
  }

  private async createAuditLogForChangePasssword(status: AuditStatus) {
    const requestContext = this.requestContext.get();

    await this.auditService.create({
      action: AuditAction.PASSWORD_CHANGE,
      status,
      userId: requestContext?.userId ?? null,
      entity: 'User',
      entityId: requestContext?.userId ?? null,
      requestId: requestContext?.requestId ?? null,
      oldValues: null,
      newValues: null,
      method: requestContext?.method ?? 'POST',
      route: requestContext?.route ?? '/user/me/password',
      ip: requestContext?.ip ?? null,
      userAgent: requestContext?.userAgent ?? null,
    });
  }
}
