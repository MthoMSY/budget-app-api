import { IsDecimal, IsEnum, IsNotEmpty } from 'class-validator';
import Decimal from 'decimal.js';
import { Category } from '../entity/category.enum';

export class CreateItemDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsDecimal()
  cost: Decimal;
  @IsEnum(Category)
  category: Category;
}
