import { AutoMocker } from 'automocker';
import { BudgetService } from '../budget.service';
import { BudgetRepository } from '../../repository/budget-repository';
import { Budget } from '../../entity/budget.entity';
import { CreateBudgetDto } from '../../dto/create-budget.dto';
import { v4 } from 'uuid';
import { User } from 'src/auth/user.entity';

describe('BudgetService', () => {
  const automocker = AutoMocker.createJestMocker(jest);
  let service: BudgetService;
  const budgetRepository = automocker.createMockInstance(BudgetRepository);

  beforeEach(async () => {
    jest.resetAllMocks();

    service = new BudgetService(budgetRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create budget', async () => {
      const request = makeCreateBudgetDto({});
      const user = makeUser({});
      const expectedResponse = makeBudget(request, user.id);
      budgetRepository.createBudget.mockResolvedValue(expectedResponse);
      const result = await service.create(request, user);

      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining({ ...expectedResponse }));
    });
  });

  describe('getById', () => {
    it('should throw an exception if no budget exists with id', async () => {
      await expect(service.getById('non-existent-id')).rejects.toThrow();
    });
    it('should call repository getById method', async () => {
      const budget = makeBudget({});
      budgetRepository.getById.mockResolvedValue(budget);
      await service.getById(budget.id);

      expect(budgetRepository.getById).toHaveBeenCalledWith(budget.id);
    });
  });

  describe('delete', () => {
    it('should throw exception when budget with given id does not exist', async () => {
      await expect(service.delete('non-existent')).rejects.toThrow();
    });
    it('should call repository deleteBudget method', async () => {
      const createdBudget = makeBudget({});
      budgetRepository.deleteBudget.mockResolvedValue(createdBudget);

      await service.delete(createdBudget.id);

      expect(budgetRepository.deleteBudget).toHaveBeenCalledWith(
        createdBudget.id,
      );
    });
  });

  describe('update name', () => {
    it('should call repository updateName', async () => {
      const budget = makeBudget({});
      const updateName = 'updatedBudget';

      service.updateName(budget.id, updateName);

      expect(budgetRepository.updateName).toHaveBeenCalledWith(
        budget.id,
        updateName,
      );
    });
  });

  describe('getBudgets', () => {
    it('should return empty array when there are no budgets', async () => {
      budgetRepository.getBudgets.mockResolvedValue([]);
      const result = await service.getBudgets({});

      expect(result).toStrictEqual([]);
      expect(budgetRepository.getBudgets).toHaveBeenCalledTimes(1);
    });
    it('should return budgets that have been created', async () => {
      const expectedBudgets = makeBudgets(3);
      budgetRepository.getBudgets.mockResolvedValue(expectedBudgets);

      const result = await service.getBudgets({});

      expect(result.length).toStrictEqual(3);
      expect(budgetRepository.getBudgets).toHaveBeenCalledTimes(1);
    });
    it('should call repository getBudgetsWithFilters with filterDto request', async () => {
      const filterDto = { name: 'Budget_02', search: '_02' };

      await service.getBudgets(filterDto);

      expect(budgetRepository.getBudgets).toHaveBeenCalledWith(filterDto);
    });
  });
});

function makeBudgets(numberOfRequests: number): Budget[] {
  const budgets: Budget[] = [];
  for (let index = 0; index < numberOfRequests; index++) {
    budgets.push({
      name: `Budget_${index + 1}`,
      description: `description`,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: v4(),
    } as Budget);
  }

  return budgets;
}

function makeBudget(
  request: Partial<CreateBudgetDto>,
  userId?: string,
): Budget {
  return {
    name: request.name ?? `Budget`,
    description: request.description ?? `description`,
    createdAt: new Date(),
    id: v4(),
    userId: userId ?? v4(),
  } as Budget;
}

function makeCreateBudgetDto(
  request: Partial<CreateBudgetDto>,
): CreateBudgetDto {
  return {
    name: request.name ?? `Budget`,
    description: request.description ?? `description`,
    items: [],
  };
}

function makeUser(request: Partial<User>): User {
  return {
    id: v4(),
    username: request.username ?? `userName`,
    password: request.password ?? `password`,
    salt: 'salty',
  } as User;
}
