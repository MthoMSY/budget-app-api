import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemService {
  private items: ItemModel[] = [];

  async getAll(): Promise<ItemModel[]> {
    return this.items;
  }

  async create(item: ItemModel): Promise<ItemModel> {
    this.items.push(item);
    return item;
  }
}
