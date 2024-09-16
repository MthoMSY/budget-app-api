import { IsNotEmpty, IsOptional } from 'class-validator';
import { Item } from '../entity/item.entity';
import Decimal from 'decimal.js';

export class CreateBudgetDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsOptional()
  items: Item[];
  @IsOptional()
  limit: Decimal;
}
