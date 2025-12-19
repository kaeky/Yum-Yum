import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimezoneToRestaurant1766093597475 implements MigrationInterface {
  name = 'AddTimezoneToRestaurant1766093597475';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "restaurants" ADD "timezone" character varying(50) NOT NULL DEFAULT 'UTC'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "timezone"`);
  }
}
