import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ItemService } from '../service/item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAllItems(): Promise<ItemModel[]> {
    return await this.itemService.getAll();
  }

  @Get()
  async getByItemId(@Query('id') id: string): Promise<ItemModel | null> {
    return await this.itemService.getById(id);
  }

  @Post()
  async createItem(@Body() request: ItemModel): Promise<ItemModel> {
    return await this.itemService.create(request);
  }

  @Delete()
  async deleteItem(@Query('id') id: string): Promise<ItemModel | null> {
    return await this.itemService.delete(id);
  }
}
