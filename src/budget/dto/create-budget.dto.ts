import { IsNotEmpty, IsOptional } from 'class-validator';
import { Item } from '../entity/item.entity';

export class CreateBudgetDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsOptional()
  items: Item[];
}
