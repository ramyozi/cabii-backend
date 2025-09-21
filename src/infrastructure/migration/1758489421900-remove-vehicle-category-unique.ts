import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveVehicleCategoryUnique1758489421900 implements MigrationInterface {
    name = 'RemoveVehicleCategoryUnique1758489421900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_79ecee6316247b06334bdb2db9c"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "category_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "UQ_79ecee6316247b06334bdb2db9c"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_79ecee6316247b06334bdb2db9c" FOREIGN KEY ("category_id") REFERENCES "vehicle_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_79ecee6316247b06334bdb2db9c"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "UQ_79ecee6316247b06334bdb2db9c" UNIQUE ("category_id")`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "category_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_79ecee6316247b06334bdb2db9c" FOREIGN KEY ("category_id") REFERENCES "vehicle_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
