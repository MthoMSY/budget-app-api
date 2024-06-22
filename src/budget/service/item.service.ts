import { Injectable } from '@nestjs/common';
import { CreateItemDto } from '../dto/create-item.dto';

@Injectable()
export class ItemService {
  private items: ItemModel[] = [];

  async getAll(): Promise<ItemModel[]> {
    return this.items;
  }

  async create(request: CreateItemDto): Promise<ItemModel> {
    const item = {
      ...request,
      createdAt: new Date(),
      updatedAt: undefined,
    };

    this.items.push(item);
    return item;
  }
}
