import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetItemFilterDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
