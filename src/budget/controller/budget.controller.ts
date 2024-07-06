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
  UseGuards,
} from '@nestjs/common';
import { BudgetService } from '../service/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { GetBudgetFilterDto } from '../dto/get-budget-filter-dto';
import { Budget } from '../entity/budget.entity';
import { UpdateBudgetNameDto } from '../dto/update-budget-name.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/user.entity';

@Controller('budget')
@UseGuards(AuthGuard())
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}


  // TODO: update all endpoints to operate on data for the logged in user.
  @Get()
  async getAllBudgets(
    @Query(ValidationPipe) filterDto: GetBudgetFilterDto,
    // @GetUser() user: User,
  ) {
    return await this.budgetService.getBudgets(filterDto);
  }

  @Get('/:id')
  async getByBudgetId(@Param('id') id: string): Promise<Budget | null> {
    return await this.budgetService.getById(id);
  }

  @Post()
  async createBudget(
    @Body(ValidationPipe) request: CreateBudgetDto,
    @GetUser() user: User,
  ): Promise<Budget> {
    return await this.budgetService.create(request, user);
  }

  @Delete('/:id')
  async deleteItem(@Param('id') budgetId: string): Promise<Budget | null> {
    return await this.budgetService.delete(budgetId);
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
