import { Body, Controller, Get, Post } from '@nestjs/common';
import { BudgetService } from '../service/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  async getAllBudgets() {
    return await this.budgetService.getAll();
  }

  @Post()
  async createBudget(@Body() request: CreateBudgetDto): Promise<BudgetModel> {
    return await this.budgetService.create(request);
  }
}
