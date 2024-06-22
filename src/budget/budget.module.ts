import { Module } from '@nestjs/common';
import { BudgetController } from './controller/budget.controller';
import { ItemController } from './controller/item.controller';
import { BudgetService } from './service/budget.service';
import { ItemService } from './service/item.service';

@Module({
  controllers: [BudgetController, ItemController],
  providers: [BudgetService, ItemService],
})
export class BudgetModule {}
