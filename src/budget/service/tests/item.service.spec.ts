import { ItemService } from '../item.service';
import { ItemRepository } from '../../repository/item-repository';
import { AutoMocker } from 'automocker';
import { Item } from 'src/budget/entity/item.entity';
import { v4 } from 'uuid';
import { CreateItemDto } from 'src/budget/dto/create-item.dto';

describe('ItemService', () => {
  const automocker = AutoMocker.createJestMocker(jest);
  let service: ItemService;
  const itemRepository = automocker.createMockInstance(ItemRepository);

  beforeEach(async () => {
    jest.resetAllMocks();

    service = new ItemService(itemRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return empty array when there are no items', async () => {
      itemRepository.getAll.mockResolvedValue([]);
      const result = await service.getAll();

      expect(result).toStrictEqual([]);
      expect(itemRepository.getAll).toHaveBeenCalledTimes(1);
    });
    it('should return items that have been created', async () => {
      const expectedItems = makeItems(3);
      itemRepository.getAll.mockResolvedValue(expectedItems);

      const result = await service.getAll();

      expect(result.length).toStrictEqual(3);
      expect(itemRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create item', async () => {
      const request = makeCreateItemDto({});
      itemRepository.createItem.mockResolvedValue(makeItem(request));
      const result = await service.create(request);

      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining({ ...request }));
    });
  });

  describe('getById', () => {
    it('should throw an exception if no item exists with id', async () => {
      await expect(service.getById('non-existent-id')).rejects.toThrow();
    });
    it('should call repository getById method', async () => {
      const item = makeItem({});
      itemRepository.getById.mockResolvedValue(item);
      await service.getById(item.id);

      expect(itemRepository.getById).toHaveBeenCalledWith(item.id);
    });
  });

  describe('delete', () => {
    it('should throw exception when item with given id does not exist', async () => {
      await expect(service.delete('non-existent')).rejects.toThrow();
    });
    it('should call repository deleteItem method', async () => {
      const createdItem = makeItem({});
      itemRepository.deleteItem.mockResolvedValue(createdItem);

      await service.delete(createdItem.id);

      expect(itemRepository.deleteItem).toHaveBeenCalledWith(createdItem.id);
    });
  });

  describe('update name', () => {
    it('should call repository updateName', async () => {
      const item = makeItem({});
      const updateName = 'updatedItem';

      service.updateName(item.id, updateName);

      expect(itemRepository.updateName).toHaveBeenCalledWith(
        item.id,
        updateName,
      );
    });
  });

  describe('getItemsWithFilters', () => {
    it('should call repository getItemsWithFilters with filterDto request', async () => {
      const filterDto = { name: 'Item_02', search: '_02' };

      await service.getItemsWithFilters(filterDto);

      expect(itemRepository.getItemsWithFilters).toHaveBeenCalledWith(
        filterDto,
      );
    });
  });
});

function makeItems(numberOfRequests: number): Item[] {
  const items: Item[] = [];
  for (let index = 0; index < numberOfRequests; index++) {
    items.push({
      cost: index + 0.5,
      name: `Item_${index + 1}`,
      description: `description`,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: v4(),
    } as Item);
  }

  return items;
}

function makeItem(request: Partial<CreateItemDto>): Item {
  return {
    cost: request.cost ?? 25,
    name: request.name ?? `Item`,
    description: request.description ?? `description`,
    id: v4(),
    createdAt: new Date(),
  } as Item;
}

function makeCreateItemDto(request: Partial<CreateItemDto>): CreateItemDto {
  return {
    cost: request.cost ?? 25,
    name: request.name ?? `Item`,
    description: request.description ?? `description`,
  };
}
