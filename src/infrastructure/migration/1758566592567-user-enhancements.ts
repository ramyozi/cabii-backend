import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEnhancements1758566592567 implements MigrationInterface {
    name = 'UserEnhancements1758566592567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "login" TO "is_active"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" TO "UQ_3cf126e6a296167f4d4d782a849"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_3cf126e6a296167f4d4d782a849"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e1f623798118e629b46a9e629" ON "user" ("phone") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8e1f623798118e629b46a9e629"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_active" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_3cf126e6a296167f4d4d782a849" UNIQUE ("is_active")`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_3cf126e6a296167f4d4d782a849" TO "UQ_a62473490b3e4578fd683235c5e"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "is_active" TO "login"`);
    }

}
