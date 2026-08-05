import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateRefreshTokenTable1785962851804 implements MigrationInterface {
  name = 'CreateRefreshTokenTable1785962851804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('refresh_tokens');
    if (tableExists) {
      return;
    }
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'user_id', type: 'uuid', isNullable: false },
          {
            name: 'token_hash',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          { name: 'expires_at', type: 'timestamp', isNullable: false },
          { name: 'revoked_at', type: 'timestamp', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'refresh_tokens',
      new TableForeignKey({
        name: 'FK_refresh_tokens_user',
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_refresh_tokens_token_hash',
        columnNames: ['token_hash'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_refresh_tokens_user_id',
        columnNames: ['user_id'],
      }),
    );
    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_refresh_tokens_expires_at',
        columnNames: ['expires_at'],
      }),
    );
    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_refresh_tokens_user_revoked',
        columnNames: ['user_id', 'revoked_at'],
      }),
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('refresh_tokens');
    if (!tableExists) {
      return;
    }
    await queryRunner.dropTable('refresh_tokens', true, true);
  }
}
