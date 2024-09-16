import { IsDecimal, IsEnum, IsOptional, IsString } from 'class-validator';
import Decimal from 'decimal.js';
import { Category } from '../entity/category.enum';

export class UpdateBudgetItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDecimal()
  cost?: Decimal;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsString()
  budgetId: string;
}
