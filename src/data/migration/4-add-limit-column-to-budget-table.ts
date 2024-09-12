import { QueryRunner, MigrationInterface, TableColumn } from 'typeorm';

const tableName = 'budget';
export class AddLimitColumnToBudgetTable1726143211390
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      tableName,
      new TableColumn({
        name: 'limit',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(tableName, 'limit');
  }
}
