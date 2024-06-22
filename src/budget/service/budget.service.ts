import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetService {
  private budgets: BudgetModel[] = [];

  async getAllBudgets(): Promise<BudgetModel[]> {
    return this.budgets;
  }

  async createBudget(budget: BudgetModel): Promise<void> {
    this.budgets.push(budget);
  }
}
