import { Logger, Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ConfigModule.forRoot(),
    BudgetModule,
    AuthModule,
  ],
})
export class AppModule {
  private logger = new Logger(AppModule.name);
  constructor(private dataSource: DataSource) {
    this.logger.debug(
      `Our datasource looks like so: ${JSON.stringify(dataSource.options)}`,
    );
  }
}
