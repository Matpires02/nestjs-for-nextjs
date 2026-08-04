import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
  })
  userId: string | null;

  @Column({
    type: 'varchar',
    length: 50,
  })
  action: AuditAction;

  @Column({
    type: 'varchar',
    length: 255,
  })
  entity: string;

  @Column({
    name: 'entity_id',
    type: 'varchar',
    nullable: true,
  })
  entityId: string | null;

  @Column({
    name: 'old_values',
    type: 'json',
    nullable: true,
  })
  oldValues: Record<string, unknown> | null;

  @Column({
    name: 'new_values',
    type: 'json',
    nullable: true,
  })
  newValues: Record<string, unknown> | null;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  method: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  route: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  ip: string | null;

  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
