import { Item } from '../entity/item.entity';
import { CreateItemDto } from '../dto/create-item.dto';
import { GetItemFilterDto } from '../dto/get-item-filter-dto';
import { Repository } from 'typeorm';

export class ItemRepository extends Repository<Item> {
  async getById(id: string): Promise<Item> {
    return await this.findOne({ where: { id } });
  }

  async getAll(): Promise<Item[]> {
    return await this.find();
  }

  async createItem(item: CreateItemDto): Promise<Item> {
    return this.save(item);
  }

  async updateName(id: string, name: string): Promise<Item | null> {
    const found = await this.findOne({ where: { id } });

    if (!found) {
      return null;
    }

    found.name = name;

    this.update(id, found);

    return found;
  }

  async deleteItem(id: string): Promise<Item | null> {
    const found = await this.findOne({ where: { id } });

    if (!found) {
      return null;
    }
    this.delete(id);

    return found;
  }

  async getItemsWithFilters(filterDto: GetItemFilterDto): Promise<Item[]> {
    if (filterDto.name && filterDto.search) {
      return await this.find({
        where: { name: filterDto.name, description: filterDto.search },
      });
    }

    if (filterDto.name) {
      return await this.find({
        where: { name: filterDto.name },
      });
    }

    if (filterDto.search) {
      return await this.find({
        where: { description: filterDto.search },
      });
    }

    return await this.getAll();
  }
}
