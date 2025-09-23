import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeVehicleOptionalInReservation1758623015592 implements MigrationInterface {
    name = 'MakeVehicleOptionalInReservation1758623015592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_8fab108410e100fb2e433658ca2"`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "vehicle_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_8fab108410e100fb2e433658ca2" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_8fab108410e100fb2e433658ca2"`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "vehicle_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_8fab108410e100fb2e433658ca2" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
