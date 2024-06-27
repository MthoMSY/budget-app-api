import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ItemService } from '../service/item.service';
import { UpdateItemNameDto } from '../dto/update-item-name.dto';
import { CreateItemDto } from '../dto/create-item.dto';
import { GetItemFilterDto } from '../dto/get-item-filter-dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getFilterItems(
    @Query() filterDto: GetItemFilterDto,
  ): Promise<ItemModel[]> {
    if (Object.keys(filterDto).length) {
      return await this.itemService.getItemsWithFilters(filterDto);
    } else {
      return await this.itemService.getAll();
    }
  }

  @Get('/:id')
  async getByItemId(@Param('id') id: string): Promise<ItemModel | null> {
    return await this.itemService.getById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createItem(@Body() request: CreateItemDto): Promise<ItemModel> {
    return await this.itemService.create(request);
  }

  @Delete('/:id')
  async deleteItem(@Param('id') id: string): Promise<ItemModel | null> {
    return await this.itemService.delete(id);
  }

  @Patch('/:id/name')
  @UsePipes(ValidationPipe)
  async updateName(
    @Param('id') id: string,
    @Body() request: UpdateItemNameDto,
  ): Promise<void> {
    return await this.itemService.updateName(id, request.name);
  }
}
