import { IsNotEmpty } from 'class-validator';
import Decimal from 'decimal.js';

export class UpdateBudgetDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  limit: Decimal;
  @IsNotEmpty()
  id: string;
}
