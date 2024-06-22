import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetService {
  private budgets: BudgetModel[] = [];

  async getAllBudgets(): Promise<BudgetModel[]> {
    return this.budgets;
  }

  async createBudget(name: string, items: ItemModel[]): Promise<void> {
    this.budgets.push({ id: this.budgets.length + 1, name, items });
  }
}
