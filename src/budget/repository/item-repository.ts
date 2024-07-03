import { Item } from '../entity/item.entity';
import { CreateItemDto } from '../dto/create-item.dto';
import { GetItemFilterDto } from '../dto/get-item-filter-dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class ItemRepository extends Repository<Item> {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {
    super(
      itemRepository.target,
      itemRepository.manager,
      itemRepository.queryRunner,
    );
  }
  async getById(id: string): Promise<Item> {
    return await this.itemRepository.findOne({ where: { id } });
  }

  async getAll(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async createItem(item: CreateItemDto): Promise<Item> {
    return this.itemRepository.save(item);
  }

  async updateName(id: string, name: string): Promise<Item | null> {
    const found = await this.itemRepository.findOne({ where: { id } });

    if (!found) {
      return null;
    }

    found.name = name;

    this.update(id, found);

    return found;
  }

  async deleteItem(id: string): Promise<Item | null> {
    const found = await this.itemRepository.findOne({ where: { id } });

    if (!found) {
      return null;
    }
    this.delete(id);

    return found;
  }

  async getItemsWithFilters(filterDto: GetItemFilterDto): Promise<Item[]> {
    if (filterDto.name && filterDto.search) {
      return await this.itemRepository.find({
        where: {
          name: Like(`%${filterDto.name}%`),
          description: Like(`%${filterDto.search}%`),
        },
      });
    }

    if (filterDto.name) {
      return await this.itemRepository.find({
        where: { name: Like(`%${filterDto.name}%`) },
      });
    }

    if (filterDto.search) {
      return await this.itemRepository.find({
        where: { description: Like(`%${filterDto.search}%`) },
      });
    }

    return await this.getAll();
  }
}
