import { Module } from '@nestjs/common';
import { BudgetController } from './controller/budget.controller';
import { ItemController } from './controller/item.controller';
import { BudgetService } from './service/budget.service';
import { ItemService } from './service/item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemRepository } from './repository/item-repository';

@Module({
  imports: [TypeOrmModule.forFeature([ItemRepository])],
  controllers: [BudgetController, ItemController],
  providers: [BudgetService, ItemService, ItemRepository],
})
export class BudgetModule {}
