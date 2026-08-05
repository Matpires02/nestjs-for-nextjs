import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAuditLogs1785890578104 implements MigrationInterface {
  name = 'CreateAuditLogs1785890578104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('audit_logs');

    if (hasTable) {
      return;
    }

    const isPostgres = queryRunner.connection.options.type === 'postgres';

    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: isPostgres ? 'uuid' : 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'user_id',
            type: isPostgres ? 'uuid' : 'varchar',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'entity',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'entity_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'old_values',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'new_values',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'method',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'route',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'ip',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: isPostgres ? 'timestamp' : 'datetime',
            default: isPostgres ? 'CURRENT_TIMESTAMP' : "(datetime('now'))",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_entity_entity_id',
        columnNames: ['entity', 'entity_id'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_user_id',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_action',
        columnNames: ['action'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_created_at',
        columnNames: ['created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('audit_logs');

    if (hasTable) {
      await queryRunner.dropTable('audit_logs', true);
    }
  }
}
