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

  @Get()
  async getAllBudgets(
    @Query(ValidationPipe) filterDto: GetBudgetFilterDto,
    @GetUser() user: User,
  ) {
    return await this.budgetService.getBudgets(filterDto, user);
  }

  @Get('/:id')
  async getByBudgetId(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Budget | null> {
    return await this.budgetService.getById(id, user);
  }

  @Post()
  async createBudget(
    @Body(ValidationPipe) request: CreateBudgetDto,
    @GetUser() user: User,
  ): Promise<Budget> {
    return await this.budgetService.create(request, user);
  }

  @Delete('/:id')
  async deleteItem(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Budget | null> {
    return await this.budgetService.delete(id, user);
  }

  @Patch('/:id/name')
  @UsePipes(ValidationPipe)
  async updateName(
    @Param('id') id: string,
    @Body() request: UpdateBudgetNameDto,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.budgetService.updateName(id, request.name, user);
  }
}
