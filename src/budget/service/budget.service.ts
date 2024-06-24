import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { v4 } from 'uuid';

@Injectable()
export class BudgetService {
  private budgets: BudgetModel[] = [];

  async getAll(): Promise<BudgetModel[]> {
    return this.budgets;
  }

  async getById(id: string): Promise<BudgetModel | null> {
    const result = this.budgets.find((budget) => budget.id === id);

    if (!result) {
      return null;
    }

    return result;
  }

  async create(request: CreateBudgetDto): Promise<BudgetModel> {
    const budget: BudgetModel = {
      id: v4(),
      ...request,
      createdAt: new Date(),
      updatedAt: undefined,
    };
    this.budgets.push(budget);

    return budget;
  }

  async delete(id: string): Promise<BudgetModel> {
    const budget = await this.getById(id);

    if (budget) {
      this.budgets = this.budgets.filter((budget) => budget.id !== id);
      return budget;
    }

    throw new NotFoundException(`Budget with id: ${id} was not found`);
  }
}
