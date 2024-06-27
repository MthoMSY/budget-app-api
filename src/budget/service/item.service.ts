import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from '../dto/create-item.dto';
import { v4 } from 'uuid';
import { GetItemFilterDto } from '../dto/get-item-filter-dto';

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

  async updateName(id: string, name: string): Promise<void> {
    const item = await this.getById(id);
    if (item) {
      item.name = name;
      item.updatedAt = new Date();
      await this.delete(id);
      this.items.push(item);
    }
  }

  async getItemsWithFilters(filterDto: GetItemFilterDto): Promise<ItemModel[]> {
    const { name, search } = filterDto;
    let items = await this.getAll();

    if (name) {
      items = items.filter((item) => name === item.name);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.description.includes(search) || item.name.includes(search),
      );
    }

    return items;
  }
}
