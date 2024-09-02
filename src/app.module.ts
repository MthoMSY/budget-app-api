import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

const Env = process.env.NODE_ENV;

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ConfigModule.forRoot({
      envFilePath: !Env ? `.env.development` : `.env.${Env}`,
    }),
    BudgetModule,
    AuthModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
