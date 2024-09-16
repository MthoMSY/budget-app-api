import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { BudgetRepository } from '../budget-repository';
import { Budget } from '../../entity/budget.entity';
import { User } from '../../../auth/user.entity';
import { Item } from '../../entity/item.entity';
import { GetBudgetFilterDto } from '../../dto/get-budget-filter-dto';
import { CreateBudgetDto } from '../../dto/create-budget.dto';
import { UpdateBudgetDto } from '../../dto/update-budget-dto';
import { UserRepository } from '../../../auth/user.repository';
import { v4 } from 'uuid';
import Decimal from 'decimal.js';
import { dropTables } from '../../../test__utils/utils';

describe('BudgetRepository', () => {
  let budgetRepository: BudgetRepository;
  let userRepository: UserRepository;
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
            entities: [Budget, User, Item],
            synchronize: configService.get('DB_SYNCHRONIZE'),
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Budget, User, Item]),
      ],
      providers: [BudgetRepository, UserRepository],
    }).compile();

    dataSource = module.get(DataSource);
    budgetRepository = module.get<BudgetRepository>(BudgetRepository);
    userRepository = module.get<UserRepository>(UserRepository);

    // Drop and recreate tables
    await dropTables(dataSource);
    await dataSource.synchronize();

    user = new User();
    user.username = 'testuser';
    user.password = 'testpassword';
    user.salt = 'testsalt';
    user = await userRepository.save(user);
  });

  afterAll(async () => {
    await dropTables(dataSource);
    await dataSource.destroy();
  });

  describe('getById', () => {
    it('should return a budget by id', async () => {
      const createBudgetDto: CreateBudgetDto = {
        name: 'Test Budget',
        description: 'Test Description',
        limit: new Decimal(1000),
        items: [],
      };
      const createdBudget = await budgetRepository.createBudget(
        createBudgetDto,
        user,
      );

      const foundBudget = await budgetRepository.getById(
        createdBudget.id,
        user,
      );
      expect(foundBudget).toBeDefined();
      expect(foundBudget?.id).toBe(createdBudget.id);
    });

    it('should return null for non-existent id', async () => {
      const nonExistentId = v4();
      const foundBudget = await budgetRepository.getById(nonExistentId, user);
      expect(foundBudget).toBeNull();
    });
  });

  describe('getByIdWithItems', () => {
    it('should return a budget with items by id', async () => {
      const createBudgetDto: CreateBudgetDto = {
        name: 'Test Budget',
        description: 'Test Description',
        limit: new Decimal(1000),
        items: [],
      };
      const createdBudget = await budgetRepository.createBudget(
        createBudgetDto,
        user,
      );

      const foundBudget = await budgetRepository.getByIdWithItems(
        createdBudget.id,
        user,
      );
      expect(foundBudget).toBeDefined();
      expect(foundBudget?.id).toBe(createdBudget.id);
      expect(foundBudget?.items).toBeDefined();
    });
  });

  describe('createBudget', () => {
    it('should create and return a new budget', async () => {
      const createBudgetDto: CreateBudgetDto = {
        name: 'New Budget',
        description: 'New Description',
        limit: new Decimal(2000),
        items: [],
      };

      const createdBudget = await budgetRepository.createBudget(
        createBudgetDto,
        user,
      );
      expect(createdBudget).toBeDefined();
      expect(createdBudget.name).toStrictEqual(createBudgetDto.name);
      expect(createdBudget.description).toStrictEqual(
        createBudgetDto.description,
      );
      expect(createdBudget.limit).toStrictEqual(createBudgetDto.limit);
      expect(createdBudget.userId).toStrictEqual(user.id);
    });
  });

  describe('updateName', () => {
    it('should update the name of an existing budget', async () => {
      const createBudgetDto: CreateBudgetDto = {
        name: 'Original Name',
        description: 'Test Description',
        limit: new Decimal(1000),
        items: [],
      };
      const createdBudget = await budgetRepository.createBudget(
        createBudgetDto,
        user,
      );

      const updatedBudget = await budgetRepository.updateName(
        createdBudget.id,
        'New Name',
        user,
      );
      expect(updatedBudget).toBeDefined();
      expect(updatedBudget?.name).toBe('New Name');
    });

    it('should return null for non-existent budget', async () => {
      const nonExistentId = v4();
      const result = await budgetRepository.updateName(
        nonExistentId,
        'New Name',
        user,
      );
      expect(result).toBeNull();
    });
  });

  describe('updateBudget', () => {
    it('should update an existing budget', async () => {
      const createBudgetDto: CreateBudgetDto = {
        name: 'Original Budget',
        description: 'Original Description',
        limit: new Decimal(1000),
        items: [],
      };
      const createdBudget = await budgetRepository.createBudget(
        createBudgetDto,
        user,
      );

      const updateBudgetDto: UpdateBudgetDto = {
        name: 'Updated Budget',
        description: 'Updated Description',
        id: createdBudget.id,
        limit: new Decimal(2000),
      };

      const updatedBudget = await budgetRepository.updateBudget(
        createdBudget.id,
        updateBudgetDto,
        user,
      );
      expect(updatedBudget).toBeDefined();
      expect(updatedBudget?.name).toBe(updateBudgetDto.name);
      expect(updatedBudget?.description).toBe(updateBudgetDto.description);
      expect(updatedBudget?.limit).toBe(updateBudgetDto.limit);
    });

    it('should return null for non-existent budget', async () => {
      const nonExistentId = v4();
      const updateBudgetDto: UpdateBudgetDto = {
        name: 'Updated Budget',
        description: 'Updated Description',
        limit: new Decimal(2000),
        id: nonExistentId,
      };
      const result = await budgetRepository.updateBudget(
        nonExistentId,
        updateBudgetDto,
        user,
      );
      expect(result).toBeNull();
    });
  });

  describe('deleteBudget', () => {
    it('should delete an existing budget and return it', async () => {
      const createBudgetDto: CreateBudgetDto = {
        name: 'Budget to Delete',
        description: 'Test Description',
        limit: new Decimal(1000),
        items: [],
      };
      const createdBudget = await budgetRepository.createBudget(
        createBudgetDto,
        user,
      );

      const deletedBudget = await budgetRepository.deleteBudget(
        createdBudget.id,
        user,
      );
      expect(deletedBudget).toBeDefined();
      expect(deletedBudget?.id).toBe(createdBudget.id);

      const foundBudget = await budgetRepository.getById(
        deletedBudget.id,
        user,
      );
      expect(foundBudget).toBeNull();
    });

    it('should return null for non-existent budget', async () => {
      const nonExistentId = v4();
      const result = await budgetRepository.deleteBudget(nonExistentId, user);
      expect(result).toBeNull();
    });
  });

  describe('getBudgets', () => {
    beforeEach(async () => {
      const budgets = [
        {
          name: 'Budget 1',
          description: 'Description 1',
          limit: new Decimal(1000),
          items: [],
        },
        {
          name: 'Budget 2',
          description: 'Description 2',
          limit: new Decimal(2000),
          items: [],
        },
        {
          name: 'Different entry',
          description: 'Another description',
          limit: new Decimal(3000),
          items: [],
        },
      ];

      for (const budget of budgets) {
        await budgetRepository.createBudget(budget, user);
      }
    });

    it('should return all budgets when no filter is provided', async () => {
      const budgets = await budgetRepository.getBudgets({}, user);
      expect(budgets.length).toBe(3);
    });

    it('should filter budgets by name', async () => {
      const filterDto: GetBudgetFilterDto = { name: 'Budget' };
      const budgets = await budgetRepository.getBudgets(filterDto, user);
      expect(budgets.length).toBe(2);
      expect(budgets.every((budget) => budget.name.includes('Budget'))).toBe(
        true,
      );
    });

    it('should filter budgets by search term in description', async () => {
      const filterDto: GetBudgetFilterDto = { search: 'Another' };
      const budgets = await budgetRepository.getBudgets(filterDto, user);
      expect(budgets.length).toBe(1);
      expect(budgets[0].description).toContain('Another');
    });

    it('should filter budgets by both name and description', async () => {
      const filterDto: GetBudgetFilterDto = {
        name: 'Different',
        search: 'Another',
      };
      const budgets = await budgetRepository.getBudgets(filterDto, user);
      expect(budgets.length).toBe(1);
      expect(budgets[0].name).toBe('Different entry');
      expect(budgets[0].description).toContain('Another');
    });
  });
});
