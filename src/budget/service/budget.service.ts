import { Injectable } from '@nestjs/common';
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
}
