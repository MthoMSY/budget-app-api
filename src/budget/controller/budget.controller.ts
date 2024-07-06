import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  ValidationPipe,
  UsePipes,
  Patch,
} from '@nestjs/common';
import { BudgetService } from '../service/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { GetBudgetFilterDto } from '../dto/get-budget-filter-dto';
import { Budget } from '../entity/budget.entity';
import { UpdateBudgetNameDto } from '../dto/update-budget-name.dto';

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

  @Patch('/:id/name')
  @UsePipes(ValidationPipe)
  async updateName(
    @Param('id') id: string,
    @Body() request: UpdateBudgetNameDto,
  ): Promise<void> {
    return await this.budgetService.updateName(id, request.name);
  }
}
