import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { BudgetRepository } from '../repository/budget-repository';
import { Budget } from '../entity/budget.entity';
import { GetBudgetFilterDto } from '../dto/get-budget-filter-dto';
import { User } from '../../auth/user.entity';
import { Item } from '../entity/item.entity';

@Injectable()
export class BudgetService {
  private logger = new Logger(BudgetService.name);
  constructor(private readonly budgetRepository: BudgetRepository) {}

  async getById(
    id: string,
    user: User,
    includeItems: boolean = false,
  ): Promise<Budget> {
    const result = includeItems
      ? await this.budgetRepository.getByIdWithItems(id, user)
      : await this.budgetRepository.getById(id, user);
    if (!result) {
      this.logger.debug(`Get by id unsuccessful, id '${id}' does not exist`);
      throw new NotFoundException(`Budget with id: ${id} was not found`);
    }
    return result;
  }
  async getBudgetItemsById(id: string, user: User): Promise<Item[]> {
    const result = await this.getById(id, user, true);
    return result.items;
  }

  async create(request: CreateBudgetDto, user: User): Promise<Budget> {
    return this.budgetRepository.createBudget(request, user);
  }

  async delete(id: string, user: User): Promise<Budget> {
    const Budget = await this.budgetRepository.deleteBudget(id, user);

    if (Budget) {
      return Budget;
    }

    this.logger.debug(`Delete budget unsuccessful, id '${id}' does not exist`);
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
