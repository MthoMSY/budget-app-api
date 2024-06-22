import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BudgetService } from '../service/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  async getAllBudgets() {
    return await this.budgetService.getAll();
  }

  @Get('/:id')
  async getByBudgetId(@Query('id') id: string): Promise<BudgetModel | null> {
    return await this.budgetService.getById(id);
  }

  @Post()
  async createBudget(@Body() request: CreateBudgetDto): Promise<BudgetModel> {
    return await this.budgetService.create(request);
  }
}
