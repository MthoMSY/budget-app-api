import { Item } from '../entity/item.entity';

export interface BudgetModel {
  name: string;
  id: string;
  items: Item[];
  createdAt: Date;
  updatedAt: Date | undefined;
}
