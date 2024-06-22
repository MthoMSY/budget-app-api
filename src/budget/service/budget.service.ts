import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetService {
  private budgets: BudgetModel[] = [];

  async getAllBudgets(): Promise<BudgetModel[]> {
    return this.budgets;
  }
}
