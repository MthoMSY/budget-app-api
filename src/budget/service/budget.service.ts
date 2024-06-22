import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';

@Injectable()
export class BudgetService {
  private budgets: BudgetModel[] = [];

  async getAll(): Promise<BudgetModel[]> {
    return this.budgets;
  }

  async create(request: CreateBudgetDto): Promise<BudgetModel> {
    const budget: BudgetModel = {
      id: this.budgets.length + 1,
      ...request,
      createdAt: new Date(),
      updatedAt: undefined
    };
    this.budgets.push(budget);

    return budget;
  }
}
