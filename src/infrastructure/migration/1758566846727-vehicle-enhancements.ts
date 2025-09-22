import { MigrationInterface, QueryRunner } from "typeorm";

export class VehicleEnhancements1758566846727 implements MigrationInterface {
    name = 'VehicleEnhancements1758566846727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "year" integer`);
        await queryRunner.query(`CREATE TYPE "public"."vehicle_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'UNDER_REVIEW')`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "status" "public"."vehicle_status_enum" NOT NULL DEFAULT 'UNDER_REVIEW'`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "insurance_expiry_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "insurance_file_url" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "UQ_51922d0c6647cb10de3f76ba4e3" UNIQUE ("plate")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "UQ_51922d0c6647cb10de3f76ba4e3"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "insurance_file_url"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "insurance_expiry_date"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."vehicle_status_enum"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "year"`);
    }

}
