import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProfileRefactorAndAddCoreEntities1758060209367 implements MigrationInterface {
    name = 'UserProfileRefactorAndAddCoreEntities1758060209367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicle_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "icon" character varying(255) NOT NULL, "max_passengers" integer NOT NULL, "cost_per_km" numeric NOT NULL, CONSTRAINT "PK_79ecee6316247b06334bdb2db9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accessibility_feature" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" character varying(500), "icon" character varying(255), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_cbe1651b4cdcc8fe652e4f35d4d" UNIQUE ("name"), CONSTRAINT "PK_94cb433ced8004136db2643769c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."driver_commission_type_enum" AS ENUM('PERCENTAGE', 'FIXED', 'MIXED')`);
        await queryRunner.query(`CREATE TABLE "driver_commission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."driver_commission_type_enum" NOT NULL, "percentage" numeric(5,2), "fixed_fee" numeric(10,2), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "driver_id" uuid, CONSTRAINT "PK_2aee76f0c733f94758472bb7806" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."driver_document_type_enum" AS ENUM('DRIVER_LICENSE', 'VEHICLE_REGISTRATION', 'INSURANCE', 'ID_CARD', 'MEDICAL_CLEARANCE')`);
        await queryRunner.query(`CREATE TYPE "public"."driver_document_status_enum" AS ENUM('PENDING', 'VALIDATED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "driver_document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."driver_document_type_enum" NOT NULL, "file_url" character varying(500) NOT NULL, "status" "public"."driver_document_status_enum" NOT NULL DEFAULT 'PENDING', "expiry_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "driver_id" uuid, CONSTRAINT "PK_21c7cd21e8a72b1209b9c4bc39d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_d3e8a37b75a6e92258188f59403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_accessibility" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, "feature_id" uuid, CONSTRAINT "PK_94de8000e8193dafebba036c955" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_available" boolean NOT NULL DEFAULT false, "driver_license_serial" character varying(255) NOT NULL, CONSTRAINT "PK_46daeaa998664a0efe635bc2a6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "brand" character varying(255) NOT NULL, "model" character varying(255) NOT NULL, "plate" character varying(255) NOT NULL, "color" character varying(255) NOT NULL, "chassis_number" character varying(255) NOT NULL, "driver_id" uuid, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle_accessibility" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "vehicle_id" uuid, "feature_id" uuid, CONSTRAINT "PK_03178bb4f0bfe315fe9e02ebd2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver_commission" ADD CONSTRAINT "FK_74968e391f12bad392f9524fbb4" FOREIGN KEY ("driver_id") REFERENCES "driver_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_document" ADD CONSTRAINT "FK_59e42b9bccddc88b2b259ddc9d8" FOREIGN KEY ("driver_id") REFERENCES "driver_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_accessibility" ADD CONSTRAINT "FK_7be28923d0ae6559dbd6bb35d5c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_accessibility" ADD CONSTRAINT "FK_411e09f421d27488bac576dd1c4" FOREIGN KEY ("feature_id") REFERENCES "accessibility_feature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_afcca29758a493752b3f133b65a" FOREIGN KEY ("driver_id") REFERENCES "driver_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicle_accessibility" ADD CONSTRAINT "FK_842c80e120ed6821460e0f70d73" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicle_accessibility" ADD CONSTRAINT "FK_3f2b2973a90cffb69ecce64fc4a" FOREIGN KEY ("feature_id") REFERENCES "accessibility_feature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_accessibility" DROP CONSTRAINT "FK_3f2b2973a90cffb69ecce64fc4a"`);
        await queryRunner.query(`ALTER TABLE "vehicle_accessibility" DROP CONSTRAINT "FK_842c80e120ed6821460e0f70d73"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_afcca29758a493752b3f133b65a"`);
        await queryRunner.query(`ALTER TABLE "user_accessibility" DROP CONSTRAINT "FK_411e09f421d27488bac576dd1c4"`);
        await queryRunner.query(`ALTER TABLE "user_accessibility" DROP CONSTRAINT "FK_7be28923d0ae6559dbd6bb35d5c"`);
        await queryRunner.query(`ALTER TABLE "driver_document" DROP CONSTRAINT "FK_59e42b9bccddc88b2b259ddc9d8"`);
        await queryRunner.query(`ALTER TABLE "driver_commission" DROP CONSTRAINT "FK_74968e391f12bad392f9524fbb4"`);
        await queryRunner.query(`DROP TABLE "vehicle_accessibility"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP TABLE "driver_profile"`);
        await queryRunner.query(`DROP TABLE "user_accessibility"`);
        await queryRunner.query(`DROP TABLE "customer_profile"`);
        await queryRunner.query(`DROP TABLE "driver_document"`);
        await queryRunner.query(`DROP TYPE "public"."driver_document_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."driver_document_type_enum"`);
        await queryRunner.query(`DROP TABLE "driver_commission"`);
        await queryRunner.query(`DROP TYPE "public"."driver_commission_type_enum"`);
        await queryRunner.query(`DROP TABLE "accessibility_feature"`);
        await queryRunner.query(`DROP TABLE "vehicle_category"`);
    }

}
