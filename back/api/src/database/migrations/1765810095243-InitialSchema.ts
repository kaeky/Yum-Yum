import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1765810095243 implements MigrationInterface {
  name = 'InitialSchema1765810095243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."reservations_status_enum" AS ENUM('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')`
    );
    await queryRunner.query(
      `CREATE TABLE "reservations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "reservationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "partySize" integer NOT NULL, "status" "public"."reservations_status_enum" NOT NULL DEFAULT 'pending', "customerName" character varying(100) NOT NULL, "customerEmail" character varying(255) NOT NULL, "customerPhone" character varying(20) NOT NULL, "specialRequests" text, "notes" text, "confirmedAt" TIMESTAMP WITH TIME ZONE, "seatedAt" TIMESTAMP WITH TIME ZONE, "completedAt" TIMESTAMP WITH TIME ZONE, "cancelledAt" TIMESTAMP WITH TIME ZONE, "cancellationReason" character varying(255), "depositAmount" numeric(10,2), "depositPaid" boolean NOT NULL DEFAULT false, "confirmationCode" character varying(255), "reminderSent" boolean NOT NULL DEFAULT false, "estimatedDuration" integer NOT NULL DEFAULT '90', "restaurantId" uuid NOT NULL, "customerId" uuid, "tableId" uuid, CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_63b138537dd4f087a673acda34" ON "reservations" ("status", "reservationDate") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_487ec4ed757eed0d34c7ddee79" ON "reservations" ("customerId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2f1a9919b2d3fdfb8a639a8305" ON "reservations" ("restaurantId", "reservationDate") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tables_status_enum" AS ENUM('available', 'occupied', 'reserved', 'cleaning', 'out_of_service')`
    );
    await queryRunner.query(
      `CREATE TABLE "tables" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "number" integer NOT NULL, "capacity" integer NOT NULL, "section" character varying(100), "floor" integer NOT NULL DEFAULT '1', "status" "public"."tables_status_enum" NOT NULL DEFAULT 'available', "isActive" boolean NOT NULL DEFAULT true, "positionX" integer, "positionY" integer, "notes" text, "restaurantId" uuid NOT NULL, CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4d622783d559b5691014c50173" ON "tables" ("restaurantId", "number") `
    );
    await queryRunner.query(
      `CREATE TABLE "menu_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "image" character varying(255), "allergens" text array NOT NULL DEFAULT '{}', "dietaryInfo" text array NOT NULL DEFAULT '{}', "calories" integer, "preparationTime" integer, "isAvailable" boolean NOT NULL DEFAULT true, "isActive" boolean NOT NULL DEFAULT true, "isSpecial" boolean NOT NULL DEFAULT false, "displayOrder" integer NOT NULL DEFAULT '0', "restaurantId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61658322e6c3d2947edebaf2f8" ON "menu_items" ("restaurantId", "isAvailable") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b887a96ba73bcd21b4956ac3c9" ON "menu_items" ("restaurantId", "categoryId") `
    );
    await queryRunner.query(
      `CREATE TABLE "menu_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "description" text, "displayOrder" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "image" character varying(255), "restaurantId" uuid NOT NULL, CONSTRAINT "PK_124ae987900336f983881cb04e6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0292844bc76177e2813694b8e" ON "menu_categories" ("restaurantId", "displayOrder") `
    );
    await queryRunner.query(
      `CREATE TABLE "restaurants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text, "cuisine" character varying(100) NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, "postalCode" character varying(20) NOT NULL, "latitude" numeric(10,7), "longitude" numeric(10,7), "priceRange" character varying(20) NOT NULL DEFAULT '€€', "rating" numeric(3,2) NOT NULL DEFAULT '0', "reviewCount" integer NOT NULL DEFAULT '0', "capacity" integer NOT NULL DEFAULT '0', "openingHours" jsonb, "settings" jsonb, "images" text array NOT NULL DEFAULT '{}', "coverImage" character varying(255), "logo" character varying(255), "amenities" text array NOT NULL DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, "isFeatured" boolean NOT NULL DEFAULT false, "ownerId" uuid NOT NULL, CONSTRAINT "UQ_afb6330c019768b4c3f9a65303c" UNIQUE ("slug"), CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_45c40d10319272c5d8db3e2781" ON "restaurants" ("city", "cuisine") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9519e81d388514ec631d23fefc" ON "restaurants" ("ownerId") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_afb6330c019768b4c3f9a65303" ON "restaurants" ("slug") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('super_admin', 'restaurant_owner', 'restaurant_staff', 'customer')`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "phone" character varying(20), "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "avatar" character varying(255), "isEmailVerified" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "lastLoginAt" TIMESTAMP WITH TIME ZONE, "refreshToken" character varying(255), "emailVerificationToken" character varying(255), "passwordResetToken" character varying(255), "passwordResetExpires" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_f290a56fcecb987c14c68414056" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_487ec4ed757eed0d34c7ddee79b" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_42ee40914a466cb26141c81e878" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tables" ADD CONSTRAINT "FK_94e0a6541322cecd437cd841701" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "menu_items" ADD CONSTRAINT "FK_a8ff5699334d3ca7b07421af0a9" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "menu_items" ADD CONSTRAINT "FK_d56e5ccc298e8bf721f75a7eb96" FOREIGN KEY ("categoryId") REFERENCES "menu_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "menu_categories" ADD CONSTRAINT "FK_99fac3bd8f4554721f954244df0" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" ADD CONSTRAINT "FK_9519e81d388514ec631d23fefca" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "restaurants" DROP CONSTRAINT "FK_9519e81d388514ec631d23fefca"`
    );
    await queryRunner.query(
      `ALTER TABLE "menu_categories" DROP CONSTRAINT "FK_99fac3bd8f4554721f954244df0"`
    );
    await queryRunner.query(
      `ALTER TABLE "menu_items" DROP CONSTRAINT "FK_d56e5ccc298e8bf721f75a7eb96"`
    );
    await queryRunner.query(
      `ALTER TABLE "menu_items" DROP CONSTRAINT "FK_a8ff5699334d3ca7b07421af0a9"`
    );
    await queryRunner.query(
      `ALTER TABLE "tables" DROP CONSTRAINT "FK_94e0a6541322cecd437cd841701"`
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_42ee40914a466cb26141c81e878"`
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_487ec4ed757eed0d34c7ddee79b"`
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_f290a56fcecb987c14c68414056"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_afb6330c019768b4c3f9a65303"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9519e81d388514ec631d23fefc"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_45c40d10319272c5d8db3e2781"`);
    await queryRunner.query(`DROP TABLE "restaurants"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d0292844bc76177e2813694b8e"`);
    await queryRunner.query(`DROP TABLE "menu_categories"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b887a96ba73bcd21b4956ac3c9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_61658322e6c3d2947edebaf2f8"`);
    await queryRunner.query(`DROP TABLE "menu_items"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4d622783d559b5691014c50173"`);
    await queryRunner.query(`DROP TABLE "tables"`);
    await queryRunner.query(`DROP TYPE "public"."tables_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2f1a9919b2d3fdfb8a639a8305"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_487ec4ed757eed0d34c7ddee79"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_63b138537dd4f087a673acda34"`);
    await queryRunner.query(`DROP TABLE "reservations"`);
    await queryRunner.query(`DROP TYPE "public"."reservations_status_enum"`);
  }
}
