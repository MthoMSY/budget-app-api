import { Like, Repository } from 'typeorm';
import { Budget } from '../entity/budget.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetBudgetFilterDto } from '../dto/get-budget-filter-dto';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { User } from 'src/auth/user.entity';

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

  async getById(id: string): Promise<Budget> {
    return await this.budgetRepository.findOne({ where: { id } });
  }

  private async getAll(): Promise<Budget[]> {
    return await this.budgetRepository.find();
  }

  async createBudget(request: CreateBudgetDto, user: User): Promise<Budget> {
    return this.budgetRepository.save({ ...request, userId: user.id });
  }

  async updateName(id: string, name: string): Promise<Budget | null> {
    const found = await this.budgetRepository.findOne({ where: { id } });

    if (!found) {
      return null;
    }

    found.name = name;

    this.update(id, found);

    return found;
  }

  async deleteBudget(id: string): Promise<Budget | null> {
    const found = await this.budgetRepository.findOne({ where: { id } });

    if (!found) {
      return null;
    }
    this.delete(id);

    return found;
  }

  async getBudgets(filterDto: GetBudgetFilterDto): Promise<Budget[]> {
    if (filterDto.name && filterDto.search) {
      return await this.budgetRepository.find({
        where: {
          name: Like(`%${filterDto.name}%`),
          description: Like(`%${filterDto.search}%`),
        },
      });
    }

    if (filterDto.name) {
      return await this.budgetRepository.find({
        where: { name: Like(`%${filterDto.name}%`) },
      });
    }

    if (filterDto.search) {
      return await this.budgetRepository.find({
        where: { description: Like(`%${filterDto.search}%`) },
      });
    }

    return await this.getAll();
  }
}
