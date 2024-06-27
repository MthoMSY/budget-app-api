import { IsNotEmpty } from 'class-validator';

export class UpdateItemNameDto {
  @IsNotEmpty()
  name: string;
}
