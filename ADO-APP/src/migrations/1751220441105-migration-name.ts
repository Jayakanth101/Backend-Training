import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1751220441105 implements MigrationInterface {
    name = 'MigrationName1751220441105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workitem" DROP COLUMN "original_estimates"`);
        await queryRunner.query(`ALTER TABLE "workitem" DROP COLUMN "remianing"`);
        await queryRunner.query(`ALTER TABLE "workitem" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "workitem" DROP COLUMN "implementation"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workitem" ADD "implementation" character varying`);
        await queryRunner.query(`ALTER TABLE "workitem" ADD "completed" integer`);
        await queryRunner.query(`ALTER TABLE "workitem" ADD "remianing" integer`);
        await queryRunner.query(`ALTER TABLE "workitem" ADD "original_estimates" integer`);
    }

}
