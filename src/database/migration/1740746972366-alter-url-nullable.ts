import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUrlNullable1740746972366 implements MigrationInterface {
    name = 'AlterUrlNullable1740746972366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE contents ALTER COLUMN url DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE contents ALTER COLUMN url SET NOT NULL`);
    }
}
