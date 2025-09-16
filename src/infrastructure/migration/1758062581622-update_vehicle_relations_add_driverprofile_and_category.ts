import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVehicleRelationsAddDriverprofileAndCategory1758062581622 implements MigrationInterface {
    name = 'UpdateVehicleRelationsAddDriverprofileAndCategory1758062581622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "category_id" uuid`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "UQ_79ecee6316247b06334bdb2db9c" UNIQUE ("category_id")`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_79ecee6316247b06334bdb2db9c" FOREIGN KEY ("category_id") REFERENCES "vehicle_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_79ecee6316247b06334bdb2db9c"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "UQ_79ecee6316247b06334bdb2db9c"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "category_id"`);
    }

}
