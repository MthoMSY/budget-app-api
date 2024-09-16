import { DataSource } from 'typeorm';

export const dropTables = async (dataSource: DataSource) => {
  await dataSource.query('DROP TABLE IF EXISTS item CASCADE');
  await dataSource.query('DROP TABLE IF EXISTS budget CASCADE');
  await dataSource.query('DROP TABLE IF EXISTS "user" CASCADE');
};
