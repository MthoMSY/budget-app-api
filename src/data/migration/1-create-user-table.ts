import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'user';

export class CreateUserTable1725298800463 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
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
            name: 'username',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'salt',
            type: 'varchar',
          },
        ],
      }),
    );
  }
  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(tableName);
  }
}
