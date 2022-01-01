import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addExpiryDate1629969543981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'token',
      new TableColumn({
        name: 'expiry_date',
        type: 'datetime',
        default: 'CURRENT_TIMESTAMP',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('token', 'expiry_date');
  }
}
