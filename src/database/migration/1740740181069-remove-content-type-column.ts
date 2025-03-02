import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveContentTypeColumn1740740181069 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE contents DROP COLUMN type`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE contents ADD COLUMN type VARCHAR NOT NULL DEFAULT 'unknown'`,
    )
  }
}
