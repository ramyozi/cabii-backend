import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryAndRidePassengerEntities1758620780619 implements MigrationInterface {
    name = 'AddDeliveryAndRidePassengerEntities1758620780619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "delivery_receiver" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying(255), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8cfe746c37c99c0e5f1ef26b7c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "delivery_object" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying(255) NOT NULL, "weight" numeric(10,2), "description" character varying(500), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "reservation_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, CONSTRAINT "PK_ff43481d276ff7e1afce8aa233a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ride_passenger" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "age" integer NOT NULL, "has_reduced_mobility" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "reservation_id" uuid NOT NULL, CONSTRAINT "PK_24be7bdcedfd682e9aa053329a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "delivery_object" ADD CONSTRAINT "FK_f0593bc6bc356fd2aeb8ae18a97" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_object" ADD CONSTRAINT "FK_3bb00dad0d63a4c2061a6e3b43a" FOREIGN KEY ("receiver_id") REFERENCES "delivery_receiver"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ride_passenger" ADD CONSTRAINT "FK_fcef30acd8ffa08ed5200b217a3" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ride_passenger" DROP CONSTRAINT "FK_fcef30acd8ffa08ed5200b217a3"`);
        await queryRunner.query(`ALTER TABLE "delivery_object" DROP CONSTRAINT "FK_3bb00dad0d63a4c2061a6e3b43a"`);
        await queryRunner.query(`ALTER TABLE "delivery_object" DROP CONSTRAINT "FK_f0593bc6bc356fd2aeb8ae18a97"`);
        await queryRunner.query(`DROP TABLE "ride_passenger"`);
        await queryRunner.query(`DROP TABLE "delivery_object"`);
        await queryRunner.query(`DROP TABLE "delivery_receiver"`);
    }

}
