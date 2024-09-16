import { Like, Repository } from 'typeorm';
import { Budget } from '../entity/budget.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetBudgetFilterDto } from '../dto/get-budget-filter-dto';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { User } from '../../auth/user.entity';
import { UpdateBudgetDto } from '../dto/update-budget-dto';

export class BudgetRepository extends Repository<Budget> {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {
    super(
      budgetRepository.target,
      budgetRepository.manager,
      budgetRepository.queryRunner,
    );
  }

  async getById(id: string, user: User): Promise<Budget> {
    return await this.budgetRepository.findOne({
      where: { id, userId: user.id },
    });
  }

  async getByIdWithItems(id: string, user: User): Promise<Budget> {
    return await this.budgetRepository.findOne({
      where: { id, userId: user.id },
      relations: {
        items: true,
      },
    });
  }

  private async getAll(userId: string): Promise<Budget[]> {
    return await this.budgetRepository.find({
      where: { userId },
      relations: {
        items: true,
      },
    });
  }

  async createBudget(request: CreateBudgetDto, user: User): Promise<Budget> {
    return this.budgetRepository.save({ ...request, userId: user.id });
  }

  async updateName(
    id: string,
    name: string,
    user: User,
  ): Promise<Budget | null> {
    const found = await this.budgetRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      return null;
    }

    found.name = name;
    found.updatedAt = new Date();

    this.update(id, found);

    return found;
  }

  async updateBudget(
    id: string,
    budget: UpdateBudgetDto,
    user: User,
  ): Promise<Budget | null> {
    const found = await this.budgetRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      return null;
    }

    const update = {
      ...found,
      updatedAt: new Date(),
      name: budget.name,
      description: budget.description,
      limit: budget.limit,
    } as Budget;

    this.update(found.id, budget);

    return update;
  }

  async deleteBudget(id: string, user: User): Promise<Budget | null> {
    const found = await this.budgetRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      return null;
    }

    await this.delete(id);

    return found;
  }

  async getBudgets(
    filterDto: GetBudgetFilterDto,
    user: User,
  ): Promise<Budget[]> {
    if (filterDto.name && filterDto.search) {
      return await this.budgetRepository.find({
        where: {
          userId: user.id,
          name: Like(`%${filterDto.name}%`),
          description: Like(`%${filterDto.search}%`),
        },
        relations: {
          items: true,
        },
      });
    }

    if (filterDto.name) {
      return await this.budgetRepository.find({
        where: { userId: user.id, name: Like(`%${filterDto.name}%`) },
        relations: {
          items: true,
        },
      });
    }

    if (filterDto.search) {
      return await this.budgetRepository.find({
        where: { userId: user.id, description: Like(`%${filterDto.search}%`) },
        relations: {
          items: true,
        },
      });
    }

    return await this.getAll(user.id);
  }
}
