import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccessibilityFeatCategoryEnum1758571777044 implements MigrationInterface {
    name = 'AddAccessibilityFeatCategoryEnum1758571777044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."accessibility_feature_category_enum" AS ENUM('MOBILITY', 'VISION', 'HEARING', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "accessibility_feature" ADD "category" "public"."accessibility_feature_category_enum" NOT NULL DEFAULT 'OTHER'`);
        await queryRunner.query(`ALTER TABLE "user_accessibility" ADD CONSTRAINT "UQ_f36b6863d0eab50c5fc70252f48" UNIQUE ("user_id", "feature_id")`);
        await queryRunner.query(`ALTER TABLE "vehicle_accessibility" ADD CONSTRAINT "UQ_733a7557b3d1b608cefa102f079" UNIQUE ("vehicle_id", "feature_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_accessibility" DROP CONSTRAINT "UQ_733a7557b3d1b608cefa102f079"`);
        await queryRunner.query(`ALTER TABLE "user_accessibility" DROP CONSTRAINT "UQ_f36b6863d0eab50c5fc70252f48"`);
        await queryRunner.query(`ALTER TABLE "accessibility_feature" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."accessibility_feature_category_enum"`);
    }

}
