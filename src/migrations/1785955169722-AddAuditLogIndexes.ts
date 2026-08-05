import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddAuditLogIndexes1785955169722 implements MigrationInterface {
  name = 'AddAuditLogIndexes1785955169722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Remove o índice antigo:
     * user_id
     */
    const table = await queryRunner.getTable('audit_logs');

    if (table) {
      const userIndex = table.indices.find(
        index => index.name === 'IDX_bd2726fd31b35443f2245b93ba',
      );

      if (userIndex) {
        await queryRunner.dropIndex('audit_logs', userIndex);
      }

      /**
       * Remove o índice antigo:
       * entity + entity_id
       */
      const entityIndex = table.indices.find(
        index => index.name === 'IDX_82edbc5f8a1821ff01b8b9c865',
      );

      if (entityIndex) {
        await queryRunner.dropIndex('audit_logs', entityIndex);
      }
    }

    /**
     * Cria índice:
     * user_id + created_at
     */
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_user_created_at',
        columnNames: ['user_id', 'created_at'],
      }),
    );

    /**
     * Cria índice:
     * entity + entity_id + created_at
     */
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_entity_entity_created_at',
        columnNames: ['entity', 'entity_id', 'created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Remove índice:
     * user_id + created_at
     */
    const table = await queryRunner.getTable('audit_logs');

    if (table) {
      const userCreatedAtIndex = table.indices.find(
        index => index.name === 'IDX_audit_logs_user_created_at',
      );

      if (userCreatedAtIndex) {
        await queryRunner.dropIndex('audit_logs', userCreatedAtIndex);
      }

      /**
       * Remove índice:
       * entity + entity_id + created_at
       */
      const entityCreatedAtIndex = table.indices.find(
        index => index.name === 'IDX_audit_logs_entity_entity_created_at',
      );

      if (entityCreatedAtIndex) {
        await queryRunner.dropIndex('audit_logs', entityCreatedAtIndex);
      }
    }

    /**
     * Restaura o índice:
     * user_id
     */
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_bd2726fd31b35443f2245b93ba',
        columnNames: ['user_id'],
      }),
    );

    /**
     * Restaura o índice:
     * entity + entity_id
     */
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_82edbc5f8a1821ff01b8b9c865',
        columnNames: ['entity', 'entity_id'],
      }),
    );
  }
}
