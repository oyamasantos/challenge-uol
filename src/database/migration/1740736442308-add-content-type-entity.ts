import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm'

export class AddContentTypeEntity1740736442308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'content_types',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', isUnique: true },
        ],
      }),
    )

    await queryRunner.addColumn(
      'contents',
      new TableColumn({ name: 'content_type_id', type: 'uuid', isNullable: true }),
    )

    await queryRunner.query(
      `INSERT INTO content_types (id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'Desconhecido')`,
    )

    await queryRunner.query(
      `UPDATE contents SET content_type_id = '00000000-0000-0000-0000-000000000000' WHERE content_type_id IS NULL`,
    )

    await queryRunner.changeColumn(
      'contents',
      'content_type_id',
      new TableColumn({ name: 'content_type_id', type: 'uuid', isNullable: false }),
    )

    await queryRunner.createForeignKey(
      'contents',
      new TableForeignKey({
        columnNames: ['content_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'content_types',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('contents', 'content_type_id')
    await queryRunner.dropColumn('contents', 'content_type_id')
    await queryRunner.dropTable('content_types')
  }
}
