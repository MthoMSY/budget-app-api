import { Module } from '@nestjs/common';
import { BudgetController } from './controller/budget.controller';
import { ItemController } from './controller/item.controller';
import { BudgetService } from './service/budget.service';
import { ItemService } from './service/item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';
import { ItemRepository } from './repository/item-repository';
import { AuthModule } from 'src/auth/auth.module';
import { Budget } from './entity/budget.entity';
import { BudgetRepository } from './repository/budget-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Budget]), AuthModule],
  controllers: [BudgetController, ItemController],
  providers: [BudgetService, ItemService, ItemRepository, BudgetRepository],
  exports: [BudgetService, TypeOrmModule],
})
export class BudgetModule {}
