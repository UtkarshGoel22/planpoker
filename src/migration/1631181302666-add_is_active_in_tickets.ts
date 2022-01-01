// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class addIsActiveInTickets1631181302666 implements MigrationInterface {
//   name = 'addIsActiveInTickets1631181302666';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       'DROP INDEX `FK_8a2d3f4d96368762ec12e548b96` ON `ticket`'
//     );
//     await queryRunner.query(
//       'ALTER TABLE `ticket` ADD `is_active` tinyint NOT NULL DEFAULT 1'
//     );
//     await queryRunner.query(
//       'ALTER TABLE `ticket` ADD CONSTRAINT `FK_8a2d3f4d96368762ec12e548b96` FOREIGN KEY (`pokerboardId`) REFERENCES `pokerboard`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       'ALTER TABLE `ticket` DROP FOREIGN KEY `FK_8a2d3f4d96368762ec12e548b96`'
//     );
//     await queryRunner.query('ALTER TABLE `ticket` DROP COLUMN `is_active`');
//     await queryRunner.query(
//       'CREATE INDEX `FK_8a2d3f4d96368762ec12e548b96` ON `ticket` (`pokerboardId`)'
//     );
//   }
// }
