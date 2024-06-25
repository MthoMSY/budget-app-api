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
    it('should return null if no item exists with id', async () => {
      const result = await service.getById('non-existent-id');

      expect(result).toEqual(null);
    });
    it('should return item', async () => {
      const item = await service.create({
        name: 'Test',
        description: 'description',
        cost: 350,
      });

      const result = await service.getById(item.id);

      expect(result).toEqual(item);
    });
  });

  describe('delete', () => {
    it('should throw not found exception when item with given id does not exist', async () => {
      await expect(service.delete('non-existent')).rejects.toThrow();
    });
    it('should return deleted item after deletion', async () => {
      const request = {
        cost: 0.5,
        name: `Item`,
        description: `description`,
      };
      const createdItem = await service.create(request);

      const deletedItem = await service.delete(createdItem.id);

      expect(deletedItem).toEqual(createdItem);

      const result = await service.getById(deletedItem.id);

      expect(result).toBe(null);
    });
  });

  describe('update name', () => {
    it('should update name of existing item', async () => {
      const request = {
        cost: 0.5,
        name: `Item`,
        description: `description`,
      };
      const updateName = 'ItemUpdate';

      const item = await service.create(request);
      service.updateName(item.id, updateName);
      const result = await service.getById(item.id);

      expect(result.name).toEqual(updateName);
    });
  });
});
