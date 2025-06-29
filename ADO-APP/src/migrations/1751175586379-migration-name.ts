import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1751175586379 implements MigrationInterface {
    name = 'MigrationName1751175586379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workitem" DROP COLUMN "original_estimates"`);
        await queryRunner.query(`ALTER TABLE "workitem" DROP COLUMN "remianing"`);
        await queryRunner.query(`ALTER TABLE "workitem" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "workitem" DROP COLUMN "implementation"`);
        await queryRunner.query(`ALTER TABLE "Epic" DROP COLUMN "original_estimates"`);
        await queryRunner.query(`ALTER TABLE "Epic" DROP COLUMN "remianing"`);
        await queryRunner.query(`ALTER TABLE "Epic" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "Epic" DROP COLUMN "implementation"`);
        await queryRunner.query(`ALTER TABLE "feature" DROP COLUMN "original_estimates"`);
        await queryRunner.query(`ALTER TABLE "feature" DROP COLUMN "remianing"`);
        await queryRunner.query(`ALTER TABLE "feature" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "feature" DROP COLUMN "implementation"`);
        await queryRunner.query(`ALTER TABLE "user_story" DROP COLUMN "original_estimates"`);
        await queryRunner.query(`ALTER TABLE "user_story" DROP COLUMN "remianing"`);
        await queryRunner.query(`ALTER TABLE "user_story" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "user_story" DROP COLUMN "implementation"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_story" ADD "implementation" character varying`);
        await queryRunner.query(`ALTER TABLE "user_story" ADD "completed" integer`);
        await queryRunner.query(`ALTER TABLE "user_story" ADD "remianing" integer`);
        await queryRunner.query(`ALTER TABLE "user_story" ADD "original_estimates" integer`);
        await queryRunner.query(`ALTER TABLE "feature" ADD "implementation" character varying`);
        await queryRunner.query(`ALTER TABLE "feature" ADD "completed" integer`);
        await queryRunner.query(`ALTER TABLE "feature" ADD "remianing" integer`);
        await queryRunner.query(`ALTER TABLE "feature" ADD "original_estimates" integer`);
        await queryRunner.query(`ALTER TABLE "Epic" ADD "implementation" character varying`);
        await queryRunner.query(`ALTER TABLE "Epic" ADD "completed" integer`);
        await queryRunner.query(`ALTER TABLE "Epic" ADD "remianing" integer`);
        await queryRunner.query(`ALTER TABLE "Epic" ADD "original_estimates" integer`);
        await queryRunner.query(`ALTER TABLE "workitem" ADD "implementation" character varying`);
        await queryRunner.query(`ALTER TABLE "workitem" ADD "completed" integer`);
        await queryRunner.query(`ALTER TABLE "workitem" ADD "remianing" integer`);
        await queryRunner.query(`ALTER TABLE "workitem" ADD "original_estimates" integer`);
    }

}
