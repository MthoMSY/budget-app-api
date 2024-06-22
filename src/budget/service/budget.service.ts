import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetService {
  private budgets: BudgetModel[] = [];

  async getAll(): Promise<BudgetModel[]> {
    return this.budgets;
  }

  async create(name: string, items: ItemModel[]): Promise<BudgetModel> {
    const budget: BudgetModel = {
      id: this.budgets.length + 1,
      name,
      items,
    };
    this.budgets.push(budget);

    return budget;
  }
}
