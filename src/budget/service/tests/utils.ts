import Decimal from 'decimal.js';
import {
  CreateBudgetDto,
  CreateBudgetItemDto,
  UpdateBudgetItemDto,
} from '../../dto';
import { v4 } from 'uuid';
import { Budget, Category, Item } from '../../entity';
import { User } from 'src/auth/user.entity';

export function makeCreateItemDto(
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

export function makeUpdateBudgetItemDto(
  request: Partial<UpdateBudgetItemDto>,
): UpdateBudgetItemDto {
  return {
    cost: request.cost ?? new Decimal('25.00'),
    name: request.name ?? `Item`,
    description: request.description ?? `description`,
    category: Category.BlackTax,
    budgetId: request.budgetId ?? v4(),
  };
}

export function makeItems(numberOfRequests: number): Item[] {
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

export function makeItem(request: Partial<CreateBudgetItemDto>): Item {
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

export function makeBudgets(numberOfRequests: number): Budget[] {
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

export function makeBudget(
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

export function makeCreateBudgetDto(
  request: Partial<CreateBudgetDto>,
): CreateBudgetDto {
  return {
    limit: request.limit ?? new Decimal(100),
    name: request.name ?? `Budget`,
    description: request.description ?? `description`,
    items: [],
  };
}

export function makeUser(request: Partial<User>): User {
  return {
    id: v4(),
    username: request.username ?? `userName`,
    password: request.password ?? `password`,
    salt: 'salty',
  } as User;
}
