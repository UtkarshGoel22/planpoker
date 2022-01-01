// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class addEstimateTimeColumn1632224940029 implements MigrationInterface {
//   name = 'addEstimateTimeColumn1632224940029';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       'ALTER TABLE `user_ticket` ADD `estimate_time` int NULL'
//     );
//     await queryRunner.query(
//       'ALTER TABLE `user_ticket` DROP FOREIGN KEY `FK_af5341f8c0b28582d959ef5dd19`'
//     );
//     await queryRunner.query('ALTER TABLE `user_ticket` DROP COLUMN `userId`');
//     await queryRunner.query(
//       'ALTER TABLE `user_ticket` ADD `userId` varchar(255) NULL'
//     );
//     await queryRunner.query(
//       'ALTER TABLE `user_ticket` ADD CONSTRAINT `FK_af5341f8c0b28582d959ef5dd19` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       'ALTER TABLE `user_ticket` DROP FOREIGN KEY `FK_af5341f8c0b28582d959ef5dd19`'
//     );
//     await queryRunner.query('ALTER TABLE `user_ticket` DROP COLUMN `userId`');
//     await queryRunner.query(
//       'ALTER TABLE `user_ticket` ADD `userId` varchar(36) NULL'
//     );
//     await queryRunner.query(
//       'ALTER TABLE `user_ticket` ADD CONSTRAINT `FK_af5341f8c0b28582d959ef5dd19` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
//     );
//     await queryRunner.query(
//       'ALTER TABLE `user_ticket` DROP COLUMN `estimate_time`'
//     );
//   }
// }
