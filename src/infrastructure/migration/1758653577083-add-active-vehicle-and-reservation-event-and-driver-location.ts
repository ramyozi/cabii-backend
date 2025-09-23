import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActiveVehicleAndReservationEventAndDriverLocation1758653577083 implements MigrationInterface {
    name = 'AddActiveVehicleAndReservationEventAndDriverLocation1758653577083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reservation_event_type_enum" AS ENUM('DRIVER_ARRIVED', 'PASSENGER_ON_BOARD', 'TRIP_STARTED', 'TRIP_COMPLETED', 'PACKAGE_PICKED_UP', 'PACKAGE_DELIVERED', 'ETA_UPDATED')`);
        await queryRunner.query(`CREATE TABLE "reservation_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."reservation_event_type_enum" NOT NULL, "payload" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "reservation_id" uuid NOT NULL, CONSTRAINT "PK_e727e788ddaa51681f0d495c6d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver_location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lat" numeric(10,6) NOT NULL, "lng" numeric(10,6) NOT NULL, "heading_deg" integer, "speed_kph" numeric(6,2), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "driver_id" uuid NOT NULL, CONSTRAINT "PK_15bd8956456fcb1985c2e6fa611" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD "active_vehicle_id" uuid`);
        await queryRunner.query(`ALTER TABLE "reservation_event" ADD CONSTRAINT "FK_b20721154df5441a5b8f0e96ef9" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_profile" ADD CONSTRAINT "FK_bc2dc881893f5d15bdd4ff746df" FOREIGN KEY ("active_vehicle_id") REFERENCES "vehicle"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_location" ADD CONSTRAINT "FK_83430f366b45a7c282a14c2c5ec" FOREIGN KEY ("driver_id") REFERENCES "driver_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_location" DROP CONSTRAINT "FK_83430f366b45a7c282a14c2c5ec"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP CONSTRAINT "FK_bc2dc881893f5d15bdd4ff746df"`);
        await queryRunner.query(`ALTER TABLE "reservation_event" DROP CONSTRAINT "FK_b20721154df5441a5b8f0e96ef9"`);
        await queryRunner.query(`ALTER TABLE "driver_profile" DROP COLUMN "active_vehicle_id"`);
        await queryRunner.query(`DROP TABLE "driver_location"`);
        await queryRunner.query(`DROP TABLE "reservation_event"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_event_type_enum"`);
    }

}
