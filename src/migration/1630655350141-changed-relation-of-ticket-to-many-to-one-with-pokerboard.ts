// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class changedRelationOfTicketToManyToOneWithPokerboard1630655350141
//   implements MigrationInterface
// {
//   name = 'changedRelationOfTicketToManyToOneWithPokerboard1630655350141';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       'ALTER TABLE `ticket` ADD `pokerboardId` varchar(36) NULL'
//     );
//     await queryRunner.query(
//       'ALTER TABLE `ticket` ADD CONSTRAINT `FK_8a2d3f4d96368762ec12e548b96` FOREIGN KEY (`pokerboardId`) REFERENCES `pokerboard`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       'ALTER TABLE `ticket` DROP FOREIGN KEY `FK_8a2d3f4d96368762ec12e548b96`'
//     );
//     await queryRunner.query('ALTER TABLE `ticket` DROP COLUMN `pokerboardId`');
//   }
// }
