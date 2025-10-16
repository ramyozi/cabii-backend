import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActiveroleToUser1760622062960 implements MigrationInterface {
    name = 'AddActiveroleToUser1760622062960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_active_role_enum" AS ENUM('ADMIN', 'DRIVER', 'CUSTOMER', 'ONBOARDING')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "active_role" "public"."user_active_role_enum" NOT NULL DEFAULT 'ONBOARDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "active_role"`);
        await queryRunner.query(`DROP TYPE "public"."user_active_role_enum"`);
    }

}
