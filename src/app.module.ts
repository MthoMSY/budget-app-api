import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), BudgetModule],
})
export class AppModule {}
