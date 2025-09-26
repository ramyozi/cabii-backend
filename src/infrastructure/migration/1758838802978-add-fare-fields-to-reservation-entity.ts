import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFareFieldsToReservationEntity1758838802978 implements MigrationInterface {
    name = 'AddFareFieldsToReservationEntity1758838802978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ADD "estimated_fare" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "final_fare" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "company_fee" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "driver_earnings" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "driver_earnings"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "company_fee"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "final_fare"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "estimated_fare"`);
    }

}
