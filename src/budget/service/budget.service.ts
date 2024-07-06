import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { BudgetRepository } from '../repository/budget-repository';
import { Budget } from '../entity/budget.entity';
import { GetBudgetFilterDto } from '../dto/get-budget-filter-dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BudgetService {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  async getById(id: string, user: User): Promise<Budget> {
    const result = await this.budgetRepository.getById(id, user);
    if (!result) {
      throw new NotFoundException(`Budget with id: ${id} was not found`);
    }
    return result;
  }

  async create(request: CreateBudgetDto, user: User): Promise<Budget> {
    return this.budgetRepository.createBudget(request, user);
  }

  async delete(id: string, user: User): Promise<Budget> {
    const Budget = await this.budgetRepository.deleteBudget(id, user);

    if (Budget) {
      return Budget;
    }

    throw new NotFoundException(`Budget with id: ${id} was not found`);
  }

  async updateName(id: string, name: string, user: User): Promise<void> {
    await this.budgetRepository.updateName(id, name, user);
  }

  async getBudgets(
    filterDto: GetBudgetFilterDto,
    user: User,
  ): Promise<Budget[]> {
    return this.budgetRepository.getBudgets(filterDto, user);
  }
}
