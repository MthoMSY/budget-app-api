import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemService } from '../service/item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAllItems(): Promise<ItemModel[]> {
    return await this.itemService.getAll();
  }

  @Post()
  async createItem(@Body() request: ItemModel) {
    await this.itemService.create(request);
  }
}
