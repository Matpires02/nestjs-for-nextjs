import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserRole1785890578103 implements MigrationInterface {
  name = 'AddUserRole1785890578103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasRole = await queryRunner.hasColumn('user', 'role');

    if (!hasRole) {
      await queryRunner.addColumn(
        'user',
        new TableColumn({
          name: 'role',
          type: 'varchar',
          length: '20',
          isNullable: false,
          default: "'USER'",
        }),
      );
    }

    await queryRunner.query(`
      UPDATE "user"
      SET "role" = 'USER'
      WHERE "role" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasRole = await queryRunner.hasColumn('user', 'role');

    if (hasRole) {
      await queryRunner.dropColumn('user', 'role');
    }
  }
}
