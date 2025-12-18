import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimeSlots1766039765169 implements MigrationInterface {
  name = 'AddTimeSlots1766039765169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."time_slots_dayofweek_enum" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')`
    );
    await queryRunner.query(
      `CREATE TABLE "time_slots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "dayOfWeek" "public"."time_slots_dayofweek_enum" NOT NULL, "openTime" TIME NOT NULL, "closeTime" TIME NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "notes" text, "restaurantId" uuid NOT NULL, CONSTRAINT "PK_f87c73d8648c3f3f297adba3cb8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca0894f7916f166f002d1909f7" ON "time_slots" ("restaurantId", "dayOfWeek") `
    );
    await queryRunner.query(
      `ALTER TABLE "time_slots" ADD CONSTRAINT "FK_5bd9c6260eb1d84c4d55a3cbf74" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "time_slots" DROP CONSTRAINT "FK_5bd9c6260eb1d84c4d55a3cbf74"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_ca0894f7916f166f002d1909f7"`);
    await queryRunner.query(`DROP TABLE "time_slots"`);
    await queryRunner.query(`DROP TYPE "public"."time_slots_dayofweek_enum"`);
  }
}
