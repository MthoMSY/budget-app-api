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

  describe('getAll', () => {
    it('should return empty array when there are no budgets', async () => {
      const result = await service.getAll();

      expect(result).toStrictEqual([]);
    });

    it('should return budgets that have been created', async () => {
      for (let index = 0; index < 3; index++) {
        await service.create({ name: `Budget_${index + 1}`, items: [] });
      }
      const result = await service.getAll();

      expect(result.length).toStrictEqual(3);
    });
  });
  describe('create', () => {
    it('should create budget', async () => {
      const request = {
        name: `Budget`,
        items: [],
      };
      const result = await service.create(request);

      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining({ ...request }));
    });
  });
  describe('getById', () => {
    it('should return null if no budget exists with id', async () => {
      const result = await service.getById('non-existent-id');

      expect(result).toEqual(null);
    });
    it('should return budget', async () => {
      const item = await service.create({
        name: 'Test',
        items: [],
      });

      const result = await service.getById(item.id);

      expect(result).toEqual(item);
    });
  });

  describe('delete', () => {
    it('should throw not found exception when budget with given id does not exist', async () => {
      await expect(service.delete('non-existent')).rejects.toThrow();
    });
    it('should return deleted budget after deletion', async () => {
      const request = {
        name: `budget`,
        items: [],
      };
      const createdItem = await service.create(request);

      const deletedItem = await service.delete(createdItem.id);

      expect(deletedItem).toEqual(createdItem);

      const result = await service.getById(deletedItem.id);

      expect(result).toBe(null);
    });
  });
});
