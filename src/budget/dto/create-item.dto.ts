import { IsDecimal, IsNotEmpty } from 'class-validator';
import Decimal from 'decimal.js';

export class CreateItemDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsDecimal()
  cost: Decimal;
}
