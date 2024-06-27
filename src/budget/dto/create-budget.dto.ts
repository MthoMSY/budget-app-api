import { IsNotEmpty } from 'class-validator';
import { Item } from '../entity/item.entity';

export class CreateBudgetDto {
  @IsNotEmpty()
  name: string;
  items: Item[];
}
