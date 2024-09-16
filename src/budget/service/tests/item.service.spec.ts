import { ItemService } from '../item.service';
import { ItemRepository } from '../../repository/item-repository';
import { AutoMocker } from 'automocker';
import { v4 } from 'uuid';
import { CreateBudgetItemDto } from '../../dto/create-budget-item.dto';
import { Item } from '../../entity/item.entity';
import Decimal from 'decimal.js';
import { Category } from '../../entity/category.enum';

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

  describe('getItems', () => {
    it('should return empty array when there are no items', async () => {
      itemRepository.getItems.mockResolvedValue([]);
      const result = await service.getItems({});

      expect(result).toStrictEqual([]);
      expect(itemRepository.getItems).toHaveBeenCalledTimes(1);
    });
    it('should return items that have been created', async () => {
      const expectedItems = makeItems(3);
      itemRepository.getItems.mockResolvedValue(expectedItems);

      const result = await service.getItems({});

      expect(result.length).toStrictEqual(3);
      expect(itemRepository.getItems).toHaveBeenCalledTimes(1);
    });
    it('should call repository getItemsWithFilters with filterDto request', async () => {
      const filterDto = { name: 'Item_02', search: '_02' };

      await service.getItems(filterDto);

      expect(itemRepository.getItems).toHaveBeenCalledWith(filterDto);
    });
  });
});

function makeItems(numberOfRequests: number): Item[] {
  const items: Item[] = [];
  for (let index = 0; index < numberOfRequests; index++) {
    items.push({
      cost: new Decimal(index.toString()).add(new Decimal('0.5')),
      name: `Item_${index + 1}`,
      description: `description`,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: v4(),
    } as Item);
  }

  return items;
}

function makeItem(request: Partial<CreateBudgetItemDto>): Item {
  return {
    cost: request.cost ?? new Decimal('25.00'),
    name: request.name ?? `Item`,
    description: request.description ?? `description`,
    category: Category.BlackTax,
    id: v4(),
    createdAt: new Date(),
    budgetId: request.budgetId ?? v4(),
  } as Item;
}

function makeCreateItemDto(
  request: Partial<CreateBudgetItemDto>,
): CreateBudgetItemDto {
  return {
    budgetId: request.budgetId ?? v4(),
    cost: request.cost ?? new Decimal('25.00'),
    name: request.name ?? `Item`,
    description: request.description ?? `description`,
    category: Category.BlackTax,
  };
}
