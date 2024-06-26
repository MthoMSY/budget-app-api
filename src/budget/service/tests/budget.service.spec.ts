import { Test, TestingModule } from '@nestjs/testing';
import { BudgetService } from '../budget.service';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetService],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllBudgets', () => {
    it('should return empty array when there are no budgets', async () => {
      const result = await service.getAllBudgets();

      expect(result).toStrictEqual([]);
    });

    it('should return budgets that have been created', async () => {
      for (let index = 0; index < 3; index++) {
        await service.createBudget({
          id: index,
          name: `Budget_${index + 1}`,
          items: [],
        });
      }
      const result = await service.getAllBudgets();

      expect(result.length).toStrictEqual(3);
      expect(result[0]).toStrictEqual({ id: 0, name: 'Budget_1', items: [] });
    });
  });
});
