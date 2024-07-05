import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetBudgetFilterDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;
  @IsOptional()
  @IsNotEmpty()
  search?: string;
}
