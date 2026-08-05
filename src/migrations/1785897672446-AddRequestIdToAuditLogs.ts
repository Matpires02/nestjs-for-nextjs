import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddRequestIdToAuditLogs1785897672446 implements MigrationInterface {
  name = 'AddRequestIdToAuditLogs1785897672446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('audit_logs', 'request_id');

    if (!hasColumn) {
      await queryRunner.addColumn(
        'audit_logs',
        new TableColumn({
          name: 'request_id',
          type: 'varchar',
          length: '100',
          isNullable: true,
        }),
      );
    }

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_request_id',
        columnNames: ['request_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('audit_logs', 'IDX_audit_logs_request_id');

    const hasColumn = await queryRunner.hasColumn('audit_logs', 'request_id');

    if (hasColumn) {
      await queryRunner.dropColumn('audit_logs', 'request_id');
    }
  }
}
