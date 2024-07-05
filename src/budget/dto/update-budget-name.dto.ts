import { IsNotEmpty } from 'class-validator';

export class UpdateBudgetNameDto {
  @IsNotEmpty()
  name: string;
}
