interface BudgetModel {
  name: string;
  id: number;
  items: ItemModel[];
  createdAt: Date;
  updatedAt: Date | undefined;
}
