import { Repository } from 'typeorm';
import { Item } from '../entity/item.entity';
import { CreateItemDto } from '../dto/create-item.dto';

export class ItemRepository extends Repository<Item> {
  async getById(id: string): Promise<Item> {
    return await this.findOne({ where: { id } });
  }

  async getAll(): Promise<Item[]> {
    throw Error('Not implemented');
  }

  async createItem(item: CreateItemDto): Promise<Item> {
    return this.create(item);
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
}
