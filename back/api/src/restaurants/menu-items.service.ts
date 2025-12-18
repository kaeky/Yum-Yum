import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { MenuCategory } from './entities/menu-category.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuCategory)
    private menuCategoryRepository: Repository<MenuCategory>
  ) {}

  async create(restaurantId: string, createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    // Verify category exists and belongs to this restaurant
    const category = await this.menuCategoryRepository.findOne({
      where: { id: createMenuItemDto.categoryId, restaurantId },
    });

    if (!category) {
      throw new NotFoundException(
        `Menu category with ID ${createMenuItemDto.categoryId} not found or does not belong to this restaurant`
      );
    }

    // Get the highest displayOrder for this category
    const maxOrderItem = await this.menuItemRepository.findOne({
      where: { categoryId: createMenuItemDto.categoryId, restaurantId },
      order: { displayOrder: 'DESC' },
    });

    const displayOrder =
      createMenuItemDto.displayOrder ?? (maxOrderItem ? maxOrderItem.displayOrder + 1 : 0);

    const item = this.menuItemRepository.create({
      ...createMenuItemDto,
      restaurantId,
      displayOrder,
      allergens: createMenuItemDto.allergens || [],
      dietaryInfo: createMenuItemDto.dietaryInfo || [],
    });

    return await this.menuItemRepository.save(item);
  }

  async findAll(restaurantId: string, categoryId?: string): Promise<MenuItem[]> {
    const where: any = { restaurantId };
    if (categoryId) {
      where.categoryId = categoryId;
    }

    return await this.menuItemRepository.find({
      where,
      order: { displayOrder: 'ASC', name: 'ASC' },
      relations: ['category'],
    });
  }

  async findOne(id: string, restaurantId: string): Promise<MenuItem> {
    const item = await this.menuItemRepository.findOne({
      where: { id, restaurantId },
      relations: ['category'],
    });

    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return item;
  }

  async update(
    id: string,
    restaurantId: string,
    updateMenuItemDto: UpdateMenuItemDto
  ): Promise<MenuItem> {
    const item = await this.findOne(id, restaurantId);

    // If categoryId is being updated, verify the new category exists
    if (updateMenuItemDto.categoryId && updateMenuItemDto.categoryId !== item.categoryId) {
      const category = await this.menuCategoryRepository.findOne({
        where: { id: updateMenuItemDto.categoryId, restaurantId },
      });

      if (!category) {
        throw new NotFoundException(
          `Menu category with ID ${updateMenuItemDto.categoryId} not found or does not belong to this restaurant`
        );
      }
    }

    Object.assign(item, updateMenuItemDto);

    return await this.menuItemRepository.save(item);
  }

  async remove(id: string, restaurantId: string): Promise<void> {
    const item = await this.findOne(id, restaurantId);
    await this.menuItemRepository.softDelete(id);
  }

  /**
   * Reorder items within a category
   */
  async reorder(restaurantId: string, categoryId: string, itemIds: string[]): Promise<MenuItem[]> {
    // Verify category belongs to this restaurant
    const category = await this.menuCategoryRepository.findOne({
      where: { id: categoryId, restaurantId },
    });

    if (!category) {
      throw new NotFoundException(
        `Menu category with ID ${categoryId} not found or does not belong to this restaurant`
      );
    }

    // Get all items in this category
    const items = await this.menuItemRepository.find({
      where: { categoryId, restaurantId },
    });

    const itemMap = new Map(items.map(item => [item.id, item]));

    // Validate that all provided IDs exist and belong to this category
    for (const id of itemIds) {
      if (!itemMap.has(id)) {
        throw new NotFoundException(
          `Menu item with ID ${id} not found or does not belong to this category`
        );
      }
    }

    // Update displayOrder for each item
    const updatePromises = itemIds.map((id, index) => {
      const item = itemMap.get(id);
      item.displayOrder = index;
      return this.menuItemRepository.save(item);
    });

    const updatedItems = await Promise.all(updatePromises);

    return updatedItems.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Toggle availability for an item
   */
  async toggleAvailability(id: string, restaurantId: string): Promise<MenuItem> {
    const item = await this.findOne(id, restaurantId);
    item.isAvailable = !item.isAvailable;
    return await this.menuItemRepository.save(item);
  }

  /**
   * Toggle active status for an item
   */
  async toggleActive(id: string, restaurantId: string): Promise<MenuItem> {
    const item = await this.findOne(id, restaurantId);
    item.isActive = !item.isActive;
    return await this.menuItemRepository.save(item);
  }

  /**
   * Get public menu (only active and available items)
   */
  async getPublicMenu(restaurantId: string): Promise<MenuCategory[]> {
    const categories = await this.menuCategoryRepository.find({
      where: { restaurantId, isActive: true },
      order: { displayOrder: 'ASC' },
    });

    // Load items for each category
    const categoriesWithItems = await Promise.all(
      categories.map(async category => {
        const items = await this.menuItemRepository.find({
          where: {
            categoryId: category.id,
            restaurantId,
            isActive: true,
            isAvailable: true,
          },
          order: { displayOrder: 'ASC' },
        });

        return {
          ...category,
          items,
        };
      })
    );

    // Filter out categories with no items
    return categoriesWithItems.filter(category => category.items.length > 0);
  }
}
