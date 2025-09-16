import { MigrationInterface, QueryRunner } from "typeorm";

export class SwitchToOnetomanyUserProfiles1758062237706 implements MigrationInterface {
    name = 'SwitchToOnetomanyUserProfiles1758062237706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_profile" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_profile" ADD CONSTRAINT "UQ_6387c1c0b04cd8c2befa882752a" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD CONSTRAINT "UQ_449b0b8e003343c52b46aeb92ae" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "customer_profile" ADD CONSTRAINT "FK_6387c1c0b04cd8c2befa882752a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD CONSTRAINT "FK_449b0b8e003343c52b46aeb92ae" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP CONSTRAINT "FK_449b0b8e003343c52b46aeb92ae"`);
        await queryRunner.query(`ALTER TABLE "customer_profile" DROP CONSTRAINT "FK_6387c1c0b04cd8c2befa882752a"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP CONSTRAINT "UQ_449b0b8e003343c52b46aeb92ae"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "customer_profile" DROP CONSTRAINT "UQ_6387c1c0b04cd8c2befa882752a"`);
        await queryRunner.query(`ALTER TABLE "customer_profile" DROP COLUMN "user_id"`);
    }

}
