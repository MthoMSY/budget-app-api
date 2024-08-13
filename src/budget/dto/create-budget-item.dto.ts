import { IsNotEmpty } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class CreateBudgetItemDto extends CreateItemDto {
  @IsNotEmpty()
  budgetId: string;
}
