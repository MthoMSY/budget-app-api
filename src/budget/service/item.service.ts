import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemService {
  private items: ItemModel[] = [];

  async getAllItems(): Promise<ItemModel[]> {
    return this.items;
  }

  async createItem(item: ItemModel): Promise<void> {
    this.items.push(item);
  }
}
