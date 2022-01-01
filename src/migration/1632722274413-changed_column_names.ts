// import {MigrationInterface, QueryRunner} from "typeorm";

// export class changedColumnNames1632722274413 implements MigrationInterface {
//     name = 'changedColumnNames1632722274413'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query("ALTER TABLE `user_invite_to_pokerboard` CHANGE `isVerified` `is_verified` tinyint NOT NULL DEFAULT '0'");
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query("ALTER TABLE `user_invite_to_pokerboard` CHANGE `is_verified` `isVerified` tinyint NOT NULL DEFAULT '0'");
//     }

// }
