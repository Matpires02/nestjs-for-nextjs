import { UserRole } from '../entities/user-role.enum';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
