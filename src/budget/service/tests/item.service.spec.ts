import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from '../item.service';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemService],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return empty array when there are no items', async () => {
      const result = await service.getAll();

      expect(result).toStrictEqual([]);
    });
    it('should return items that have been created', async () => {
      for (let index = 0; index < 3; index++) {
        await service.create({
          cost: index + 0.5,
          name: `Item_${index + 1}`,
          description: `description`,
        });
      }
      const result = await service.getAll();

      expect(result.length).toStrictEqual(3);
    });
  });

  describe('create', () => {
    it('should create item', async () => {
      const request = {
        cost: 0.5,
        name: `Item`,
        description: `description`,
      };
      const result = await service.create(request);

      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining({ ...request }));
    });
  });

  describe('getById', () => {
    it.todo('should return null if no item exists with id');
    it.todo('should return item');
  });
});
