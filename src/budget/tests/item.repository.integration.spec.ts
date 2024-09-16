import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ItemRepository } from '../repository/item-repository';
import { Item } from '../entity/item.entity';
import { User } from '../../auth/user.entity';
import { Budget } from '../entity/budget.entity';
import { GetItemFilterDto } from '../dto/get-item-filter-dto';
import Decimal from 'decimal.js';
import { Category } from '../entity/category.enum';
import { CreateBudgetItemDto } from '../dto/create-budget-item.dto';
import { UserRepository } from '../../auth/user.repository';
import { BudgetRepository } from '../repository/budget-repository';
import { v4 } from 'uuid';
describe('ItemRepository', () => {
  let itemRepository: ItemRepository;
  let userRepository: UserRepository;
  let budgetRepository: BudgetRepository;
  let budget: Budget;
  let user: User;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.test'] }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [Item, Budget, User],
            synchronize: configService.get('DB_SYNCHRONIZE'),
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Item, Budget, User]),
      ],
      providers: [ItemRepository, UserRepository, BudgetRepository],
    }).compile();

    dataSource = module.get(DataSource);
    itemRepository = module.get<ItemRepository>(ItemRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    budgetRepository = module.get<BudgetRepository>(BudgetRepository);
    // Drop and recreate tables
    await dataSource.query('DROP TABLE IF EXISTS item CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS budget CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS "user" CASCADE');
    await dataSource.synchronize();

    user = new User();
    user.username = 'testuser';
    user.password = 'testpassword';
    user.salt = 'testsalt';
    user = await userRepository.save(user);

    budget = new Budget();
    budget.name = 'Test Budget';
    budget.userId = user.id;
    budget.description = 'Test Budget Description';
    budget = await budgetRepository.save(budget);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('getById', () => {
    it('should return an item by id', async () => {
      const createBudgetItemDto: CreateBudgetItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        cost: new Decimal(10.99),
        category: Category.BlackTax,
        budgetId: budget.id,
      };
      const createdItem = await itemRepository.createItem(createBudgetItemDto);

      const foundItem = await itemRepository.getById(createdItem.id);
      expect(foundItem).toBeDefined();
      expect(foundItem.id).toBe(createdItem.id);
    });

    it('should return undefined for non-existent id', async () => {
      const nonExistentId = v4();
      const foundItem = await itemRepository.getById(nonExistentId);
      expect(foundItem).toBeNull();
    });
  });

  describe('createItem', () => {
    it('should create and return a new item', async () => {
      const createBudgetItemDto: CreateBudgetItemDto = {
        name: 'New Item',
        description: 'New Description',
        cost: new Decimal(15.99),
        category: Category.BlackTax,
        budgetId: budget.id,
      };

      const createdItem = await itemRepository.createItem(createBudgetItemDto);
      expect(createdItem).toBeDefined();
      expect(createdItem.name).toBe(createBudgetItemDto.name);
      expect(createdItem.description).toBe(createBudgetItemDto.description);
      expect(createdItem.cost).toBe(createBudgetItemDto.cost);
      expect(createdItem.category).toBe(createBudgetItemDto.category);
    });
  });

  describe('updateName', () => {
    it('should update the name of an existing item', async () => {
      const createItemDto: CreateBudgetItemDto = {
        name: 'Original Name',
        description: 'Test Description',
        cost: new Decimal(10.99),
        category: Category.BlackTax,
        budgetId: budget.id,
      };
      const createdItem = await itemRepository.createItem(createItemDto);

      const updatedItem = await itemRepository.updateName(
        createdItem.id,
        'New Name',
      );
      expect(updatedItem).toBeDefined();
      expect(updatedItem.name).toBe('New Name');
    });

    it('should return null for non-existent item', async () => {
      const nonExistentId = v4();
      const result = await itemRepository.updateName(nonExistentId, 'New Name');
      expect(result).toBeNull();
    });
  });

  describe('deleteItem', () => {
    it('should delete an existing item and return it', async () => {
      const createBudgetItemDto: CreateBudgetItemDto = {
        name: 'Item to Delete',
        description: 'Test Description',
        cost: new Decimal(10.99),
        category: Category.BlackTax,
        budgetId: budget.id,
      };
      const createdItem = await itemRepository.createItem(createBudgetItemDto);

      const deletedItem = await itemRepository.deleteItem(createdItem.id);
      expect(deletedItem).toBeDefined();
      expect(deletedItem.id).toBe(createdItem.id);

      const foundItem = await itemRepository.getById(createdItem.id);
      expect(foundItem).not.toBeNull();
    });

    it('should return null for non-existent item', async () => {
      const nonExistentId = v4();
      const result = await itemRepository.deleteItem(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe('getItems', () => {
    beforeEach(async () => {
      const items = [
        {
          name: 'Item 1',
          description: 'Description 1',
          cost: new Decimal(10.99),
          category: Category.BlackTax,
        },
        {
          name: 'Item 2',
          description: 'Description 2',
          cost: new Decimal(20.99),
          category: Category.BlackTax,
        },
        {
          name: 'Different entry',
          description: 'Another description',
          cost: new Decimal(30.99),
          category: Category.BlackTax,
        },
      ];

      for (const item of items) {
        await itemRepository.createItem({ ...item, budgetId: budget.id });
      }
    });

    it('should return all items when no filter is provided', async () => {
      const items = await itemRepository.getItems({});
      expect(items.length).toBe(3);
    });

    it('should filter items by name', async () => {
      const filterDto: GetItemFilterDto = { name: 'Item' };
      const items = await itemRepository.getItems(filterDto);
      expect(items.length).toBe(2);
      expect(items.every((item) => item.name.includes('Item'))).toBe(true);
    });

    it('should filter items by search term in description', async () => {
      const filterDto: GetItemFilterDto = { search: 'Another' };
      const items = await itemRepository.getItems(filterDto);
      expect(items.length).toBe(1);
      expect(items[0].description).toContain('Another');
    });

    it('should filter items by both name and description', async () => {
      const filterDto: GetItemFilterDto = {
        name: 'Different',
        search: 'Another',
      };
      const items = await itemRepository.getItems(filterDto);
      expect(items.length).toBe(1);
      expect(items[0].name).toBe('Different entry');
      expect(items[0].description).toContain('Another');
    });
  });
});
