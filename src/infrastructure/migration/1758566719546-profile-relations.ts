import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfileRelations1758566719546 implements MigrationInterface {
    name = 'ProfileRelations1758566719546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_profile" DROP CONSTRAINT "FK_6387c1c0b04cd8c2befa882752a"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP CONSTRAINT "FK_449b0b8e003343c52b46aeb92ae"`);
        await queryRunner.query(`ALTER TABLE "customer_profile" ADD CONSTRAINT "FK_6387c1c0b04cd8c2befa882752a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD CONSTRAINT "FK_449b0b8e003343c52b46aeb92ae" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP CONSTRAINT "FK_449b0b8e003343c52b46aeb92ae"`);
        await queryRunner.query(`ALTER TABLE "customer_profile" DROP CONSTRAINT "FK_6387c1c0b04cd8c2befa882752a"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD CONSTRAINT "FK_449b0b8e003343c52b46aeb92ae" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_profile" ADD CONSTRAINT "FK_6387c1c0b04cd8c2befa882752a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
