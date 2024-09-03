import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({ path: envFile });
console.log(__dirname);
export const AppDatasource = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  host: process.env.DB_HOST,
  entities: [__dirname + '/../**/*.entity.js'],
  migrations: [__dirname + '/migration/*.ts'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
});
