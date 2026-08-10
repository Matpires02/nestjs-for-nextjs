import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user-role.enum';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ enum: UserRole })
  readonly role?: UserRole;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.role = user.role;
  }
}
