interface BudgetModel {
  name: string;
  id: string;
  items: ItemModel[];
  createdAt: Date;
  updatedAt: Date | undefined;
}
