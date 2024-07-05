import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { BudgetService } from '../service/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { GetBudgetFilterDto } from '../dto/get-budget-filter-dto';
import { Budget } from '../entity/budget.entity';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  async getAllBudgets(@Query(ValidationPipe) filterDto: GetBudgetFilterDto) {
    return await this.budgetService.getBudgets(filterDto);
  }

  @Get('/:id')
  async getByBudgetId(@Param('id') id: string): Promise<Budget | null> {
    return await this.budgetService.getById(id);
  }

  @Post()
  async createBudget(
    @Body(ValidationPipe) request: CreateBudgetDto,
  ): Promise<Budget> {
    return await this.budgetService.create(request);
  }

  @Delete('/:id')
  async deleteItem(@Param('id') id: string): Promise<Budget | null> {
    return await this.budgetService.delete(id);
  }
}
