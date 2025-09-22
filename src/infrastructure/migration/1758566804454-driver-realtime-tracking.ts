import { MigrationInterface, QueryRunner } from "typeorm";

export class DriverRealtimeTracking1758566804454 implements MigrationInterface {
    name = 'DriverRealtimeTracking1758566804454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD "rating_avg" numeric(3,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD "total_ratings" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD "current_lat" numeric(9,6)`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD "current_lng" numeric(9,6)`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD "last_seen_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP COLUMN "last_seen_at"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP COLUMN "current_lng"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP COLUMN "current_lat"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP COLUMN "total_ratings"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP COLUMN "rating_avg"`);
    }

}
