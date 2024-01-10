import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1704877105357 implements MigrationInterface {
    name = 'PostRefactoring1704877105357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` DROP COLUMN \`expired_at\``);
        await queryRunner.query(`ALTER TABLE \`token\` ADD \`expired_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`token\` DROP COLUMN \`expiry_date\``);
        await queryRunner.query(`ALTER TABLE \`token\` ADD \`expiry_date\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` DROP COLUMN \`expiry_date\``);
        await queryRunner.query(`ALTER TABLE \`token\` ADD \`expiry_date\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`token\` DROP COLUMN \`expired_at\``);
        await queryRunner.query(`ALTER TABLE \`token\` ADD \`expired_at\` datetime NULL`);
    }

}
