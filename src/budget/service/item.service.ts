import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from '../dto/create-item.dto';
import { v4 } from 'uuid';
import { json } from 'stream/consumers';

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

  async delete(id: string): Promise<ItemModel> {
    const item = await this.getById(id);

    if (item) {
      this.items = this.items.filter((item) => item.id !== id);
      return item;
    }

    throw new NotFoundException(`Item with id: ${id} was not found`);
  }
}
