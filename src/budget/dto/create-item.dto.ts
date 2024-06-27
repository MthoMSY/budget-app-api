import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNumber()
  cost: number;
}
