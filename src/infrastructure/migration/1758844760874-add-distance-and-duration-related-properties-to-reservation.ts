import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDistanceAndDurationRelatedPropertiesToReservation1758844760874 implements MigrationInterface {
    name = 'AddDistanceAndDurationRelatedPropertiesToReservation1758844760874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ADD "estimated_distance_meters" numeric`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "actual_distance_meters" numeric`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "estimated_duration_seconds" integer`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "actual_duration_seconds" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "actual_duration_seconds"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "estimated_duration_seconds"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "actual_distance_meters"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "estimated_distance_meters"`);
    }

}
