import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAuditStatus1785952542383 implements MigrationInterface {
  name = 'AddAuditStatus1785952542383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasRole = await queryRunner.hasColumn('audit_logs', 'status');

    if (!hasRole) {
      await queryRunner.addColumn(
        'audit_logs',
        new TableColumn({
          name: 'status',
          type: 'varchar',
          length: '10',
          isNullable: false,
          default: "'SUCCESS'",
        }),
      );
    }

    await queryRunner.query(`
      UPDATE "audit_logs"
      SET "status" = 'SUCCESS'
      WHERE "status" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasRole = await queryRunner.hasColumn('audit_logs', 'status');

    if (hasRole) {
      await queryRunner.dropColumn('audit_logs', 'status');
    }
  }
}
