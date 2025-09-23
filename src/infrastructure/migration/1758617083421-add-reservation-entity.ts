import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReservationEntity1758617083421 implements MigrationInterface {
    name = 'AddReservationEntity1758617083421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reservation_type_enum" AS ENUM('RIDE', 'DELIVERY')`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."reservation_type_enum" NOT NULL, "status" "public"."reservation_status_enum" NOT NULL DEFAULT 'PENDING', "pickup_lat" numeric(10,6) NOT NULL, "pickup_lng" numeric(10,6) NOT NULL, "dropoff_lat" numeric(10,6) NOT NULL, "dropoff_lng" numeric(10,6) NOT NULL, "scheduled_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customer_id" uuid NOT NULL, "driver_id" uuid, "vehicle_id" uuid NOT NULL, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_ffb0414171d826ee21f993f17fe" FOREIGN KEY ("customer_id") REFERENCES "customer_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_b0219e47f8923637ca027685094" FOREIGN KEY ("driver_id") REFERENCES "driver_profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_8fab108410e100fb2e433658ca2" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_8fab108410e100fb2e433658ca2"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_b0219e47f8923637ca027685094"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_ffb0414171d826ee21f993f17fe"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_type_enum"`);
    }

}
