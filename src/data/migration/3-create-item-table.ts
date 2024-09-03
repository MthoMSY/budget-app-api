import { Category } from '../../budget/entity/category.enum';
import {
  QueryRunner,
  Table,
  MigrationInterface,
  TableForeignKey,
} from 'typeorm';

const tableName = 'item';
export class CreateItemTable1725298831183 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'budgetId',
            type: 'uuid',
          },
          {
            name: 'cost',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'enum',
            enum: Object.keys(Category),
            enumName: 'Category',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: ['budgetId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'budget',
        onDelete: 'CASCADE',
      }),
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    const foreignKey = table.foreignKeys.find((fk) => {
      fk.columnNames.indexOf('budgetId') !== -1;
    });

    await queryRunner.dropForeignKey(tableName, foreignKey);
    await queryRunner.dropTable(tableName);
  }
}
