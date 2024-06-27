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
    it('should throw an exception if no item exists with id', async () => {
      await expect(service.getById('non-existent-id')).rejects.toThrow();
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
    it('should throw exception when item with given id does not exist', async () => {
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

      await expect(service.getById(deletedItem.id)).rejects.toThrow();
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

  describe('getItemsWithFilters', () => {
    let filterDto = {};
    beforeEach(async () => {
      for (let index = 0; index < 5; index++) {
        await service.create({
          cost: index * 0.5,
          name: `Item_0${index}`,
          description: `description_0${index}`,
        });
      }
    });

    it('should filter by name', async () => {
      const expectedItemName = 'Item_02';
      filterDto = { name: expectedItemName };

      const result = await service.getItemsWithFilters(filterDto);

      expect(result.length).toEqual(1);
    });

    it('should filter description by search criteria', async () => {
      const search = '_02';
      filterDto = { search };

      const result = await service.getItemsWithFilters(filterDto);

      expect(result.length).toEqual(1);
    });

    it('should filter by both name and description', async () => {
      const search = '_02';
      const name = 'Item_02';
      filterDto = { name: '', search };

      const result = await service.getItemsWithFilters(filterDto);

      expect(result.length).toEqual(1);
      expect(result[0].name).toEqual(name);
      expect(result[0].description).toEqual(`description${search}`);
    });
  });
});
