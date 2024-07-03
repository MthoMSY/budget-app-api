import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Item } from 'src/budget/entity/item.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 3555,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [Item],
  synchronize: true,
};
