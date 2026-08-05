import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('refresh_tokens')
@Index(['userId'])
@Index(['userId', 'revokedAt'])
@Index(['tokenHash'], { unique: true })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    name: 'token_hash',
    type: 'varchar',
    length: 255,
  })
  tokenHash: string;

  @Column({
    name: 'expires_at',
    type: 'datetime',
  })
  expiresAt: Date;

  @Column({
    name: 'revoked_at',
    type: 'datetime',
    nullable: true,
  })
  revokedAt: Date | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
