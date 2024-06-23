import { Injectable } from '@nestjs/common';
import { CreateItemDto } from '../dto/create-item.dto';
import { v4 } from 'uuid';

@Injectable()
export class ItemService {
  private items: ItemModel[] = [];

  async getAll(): Promise<ItemModel[]> {
    return this.items;
  }

  async getById(id: string): Promise<ItemModel | null> {
    const result = this.items.find((item) => item.id === id);
    if (!result) {
      return null;
    }
    return result;
  }

  async create(request: CreateItemDto): Promise<ItemModel> {
    const item = {
      id: v4(),
      ...request,
      createdAt: new Date(),
      updatedAt: undefined,
    };

    this.items.push(item);
    return item;
  }
}
