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
  UseGuards,
} from '@nestjs/common';
import { ItemService } from '../service/item.service';
import { UpdateItemNameDto } from '../dto/update-item-name.dto';
import { GetItemFilterDto } from '../dto/get-item-filter-dto';
import { Item } from '../entity/item.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateBudgetItemDto } from '../dto/create-budget-item.dto';
import { ApiVersion } from 'src/common/api-version.enum';
import { UpdateBudgetItemDto } from '../dto/update-budget-item.dto';

@Controller(`${ApiVersion.V1}/item`)
@UseGuards(AuthGuard())
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAll(
    @Query(ValidationPipe) filterDto: GetItemFilterDto,
  ): Promise<Item[]> {
    return await this.itemService.getItems(filterDto);
  }

  @Get('/:id')
  async getByItemId(@Param('id') id: string): Promise<Item | null> {
    return await this.itemService.getById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createItem(@Body() request: CreateBudgetItemDto): Promise<Item> {
    return await this.itemService.create(request);
  }

  @Post('/budget')
  @UsePipes(ValidationPipe)
  async createBudgetItem(@Body() request: CreateBudgetItemDto): Promise<Item> {
    return await this.itemService.create(request);
  }

  @Delete('/:id')
  async deleteItem(@Param('id') id: string): Promise<Item | null> {
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

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateBudgetItem(
    @Param('id') id: string,
    @Body() updateBudgetItemDto: UpdateBudgetItemDto,
  ): Promise<Item> {
    return await this.itemService.updateBudgetItem(id, updateBudgetItemDto);
  }
}
