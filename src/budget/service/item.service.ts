import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from '../dto/create-item.dto';
import { GetItemFilterDto } from '../dto/get-item-filter-dto';
import { Item } from '../entity/item.entity';
import { ItemRepository } from '../repository/item-repository';

@Injectable()
export class ItemService {
  private logger = new Logger(ItemService.name);
  constructor(private readonly itemRepository: ItemRepository) {}

  async getById(id: string): Promise<Item> {
    const result = await this.itemRepository.getById(id);
    if (!result) {
      this.logger.debug(`Delete failed, item with id '${id}' does not exist`);
      throw new NotFoundException(`Item with id: ${id} was not found`);
    }
    return result;
  }

  async create(request: CreateItemDto): Promise<Item> {
    return this.itemRepository.createItem(request);
  }

  async delete(id: string): Promise<Item> {
    const item = await this.itemRepository.deleteItem(id);

    if (item) {
      return item;
    }

    this.logger.debug(`Delete failed, item with id '${id}' does not exist`);
    throw new NotFoundException(`Item with id: ${id} was not found`);
  }

  async updateName(id: string, name: string): Promise<void> {
    await this.itemRepository.updateName(id, name);
  }

  async getItems(filterDto: GetItemFilterDto): Promise<Item[]> {
    return this.itemRepository.getItems(filterDto);
  }
}
