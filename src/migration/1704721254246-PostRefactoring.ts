import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1704721254246 implements MigrationInterface {
    name = 'PostRefactoring1704721254246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_invite_to_pokerboard\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`pokerboardId\` varchar(255) NULL, \`is_verified\` tinyint NOT NULL DEFAULT 0, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` varchar(36) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expired_at\` datetime NULL, \`expiry_date\` datetime NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_pokerboard\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` varchar(255) NOT NULL, \`invite_status\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`userId\` varchar(255) NULL, \`pokerboardId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`is_verified\` tinyint NOT NULL DEFAULT 0, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_ticket\` (\`id\` int NOT NULL AUTO_INCREMENT, \`estimate\` int NOT NULL, \`estimate_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`estimate_time\` int NULL, \`userId\` varchar(255) NULL, \`ticketId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ticket\` (\`id\` varchar(255) NOT NULL, \`summary\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`estimate\` int NULL, \`type\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`pokerboardId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pokerboard\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`manager\` varchar(255) NOT NULL, \`deck_type\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`group\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`admin\` varchar(255) NOT NULL, \`count_of_members\` int NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8a45300fd825918f3b40195fbd\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_groups_group\` (\`userId\` varchar(36) NOT NULL, \`groupId\` varchar(36) NOT NULL, INDEX \`IDX_84ff6a520aee2bf2512c01cf46\` (\`userId\`), INDEX \`IDX_8abdfe8f9d78a4f5e821dbf620\` (\`groupId\`), PRIMARY KEY (\`userId\`, \`groupId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pokerboard_groups_group\` (\`pokerboardId\` varchar(36) NOT NULL, \`groupId\` varchar(36) NOT NULL, INDEX \`IDX_ffe4195e5ed25389b8c88b06d1\` (\`pokerboardId\`), INDEX \`IDX_5155334eab98db1c24df90577b\` (\`groupId\`), PRIMARY KEY (\`pokerboardId\`, \`groupId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_invite_to_pokerboard\` ADD CONSTRAINT \`FK_5ec277b030268747cfab2e92bcd\` FOREIGN KEY (\`pokerboardId\`) REFERENCES \`pokerboard\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`token\` ADD CONSTRAINT \`FK_94f168faad896c0786646fa3d4a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_pokerboard\` ADD CONSTRAINT \`FK_a146f2bdc76720b0b54d285db25\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_pokerboard\` ADD CONSTRAINT \`FK_98438a74a664b6221b58e21b6ef\` FOREIGN KEY (\`pokerboardId\`) REFERENCES \`pokerboard\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_ticket\` ADD CONSTRAINT \`FK_af5341f8c0b28582d959ef5dd19\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_ticket\` ADD CONSTRAINT \`FK_fa298f42e916dffbd57dd496721\` FOREIGN KEY (\`ticketId\`) REFERENCES \`ticket\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_8a2d3f4d96368762ec12e548b96\` FOREIGN KEY (\`pokerboardId\`) REFERENCES \`pokerboard\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` ADD CONSTRAINT \`FK_84ff6a520aee2bf2512c01cf462\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` ADD CONSTRAINT \`FK_8abdfe8f9d78a4f5e821dbf6203\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pokerboard_groups_group\` ADD CONSTRAINT \`FK_ffe4195e5ed25389b8c88b06d16\` FOREIGN KEY (\`pokerboardId\`) REFERENCES \`pokerboard\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`pokerboard_groups_group\` ADD CONSTRAINT \`FK_5155334eab98db1c24df90577b3\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pokerboard_groups_group\` DROP FOREIGN KEY \`FK_5155334eab98db1c24df90577b3\``);
        await queryRunner.query(`ALTER TABLE \`pokerboard_groups_group\` DROP FOREIGN KEY \`FK_ffe4195e5ed25389b8c88b06d16\``);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` DROP FOREIGN KEY \`FK_8abdfe8f9d78a4f5e821dbf6203\``);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` DROP FOREIGN KEY \`FK_84ff6a520aee2bf2512c01cf462\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_8a2d3f4d96368762ec12e548b96\``);
        await queryRunner.query(`ALTER TABLE \`user_ticket\` DROP FOREIGN KEY \`FK_fa298f42e916dffbd57dd496721\``);
        await queryRunner.query(`ALTER TABLE \`user_ticket\` DROP FOREIGN KEY \`FK_af5341f8c0b28582d959ef5dd19\``);
        await queryRunner.query(`ALTER TABLE \`user_pokerboard\` DROP FOREIGN KEY \`FK_98438a74a664b6221b58e21b6ef\``);
        await queryRunner.query(`ALTER TABLE \`user_pokerboard\` DROP FOREIGN KEY \`FK_a146f2bdc76720b0b54d285db25\``);
        await queryRunner.query(`ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_94f168faad896c0786646fa3d4a\``);
        await queryRunner.query(`ALTER TABLE \`user_invite_to_pokerboard\` DROP FOREIGN KEY \`FK_5ec277b030268747cfab2e92bcd\``);
        await queryRunner.query(`DROP INDEX \`IDX_5155334eab98db1c24df90577b\` ON \`pokerboard_groups_group\``);
        await queryRunner.query(`DROP INDEX \`IDX_ffe4195e5ed25389b8c88b06d1\` ON \`pokerboard_groups_group\``);
        await queryRunner.query(`DROP TABLE \`pokerboard_groups_group\``);
        await queryRunner.query(`DROP INDEX \`IDX_8abdfe8f9d78a4f5e821dbf620\` ON \`user_groups_group\``);
        await queryRunner.query(`DROP INDEX \`IDX_84ff6a520aee2bf2512c01cf46\` ON \`user_groups_group\``);
        await queryRunner.query(`DROP TABLE \`user_groups_group\``);
        await queryRunner.query(`DROP INDEX \`IDX_8a45300fd825918f3b40195fbd\` ON \`group\``);
        await queryRunner.query(`DROP TABLE \`group\``);
        await queryRunner.query(`DROP TABLE \`pokerboard\``);
        await queryRunner.query(`DROP TABLE \`ticket\``);
        await queryRunner.query(`DROP TABLE \`user_ticket\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`user_pokerboard\``);
        await queryRunner.query(`DROP TABLE \`token\``);
        await queryRunner.query(`DROP TABLE \`user_invite_to_pokerboard\``);
    }

}
