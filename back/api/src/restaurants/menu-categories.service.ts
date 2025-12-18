import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from './entities/menu-category.entity';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';

@Injectable()
export class MenuCategoriesService {
  constructor(
    @InjectRepository(MenuCategory)
    private menuCategoryRepository: Repository<MenuCategory>
  ) {}

  async create(
    restaurantId: string,
    createMenuCategoryDto: CreateMenuCategoryDto
  ): Promise<MenuCategory> {
    // Get the highest displayOrder for this restaurant
    const maxOrderCategory = await this.menuCategoryRepository.findOne({
      where: { restaurantId },
      order: { displayOrder: 'DESC' },
    });

    const displayOrder =
      createMenuCategoryDto.displayOrder ??
      (maxOrderCategory ? maxOrderCategory.displayOrder + 1 : 0);

    const category = this.menuCategoryRepository.create({
      ...createMenuCategoryDto,
      restaurantId,
      displayOrder,
    });

    return await this.menuCategoryRepository.save(category);
  }

  async findAll(restaurantId: string): Promise<MenuCategory[]> {
    return await this.menuCategoryRepository.find({
      where: { restaurantId },
      order: { displayOrder: 'ASC', name: 'ASC' },
      relations: ['items'],
    });
  }

  async findOne(id: string, restaurantId: string): Promise<MenuCategory> {
    const category = await this.menuCategoryRepository.findOne({
      where: { id, restaurantId },
      relations: ['items'],
    });

    if (!category) {
      throw new NotFoundException(`Menu category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    restaurantId: string,
    updateMenuCategoryDto: UpdateMenuCategoryDto
  ): Promise<MenuCategory> {
    const category = await this.findOne(id, restaurantId);

    Object.assign(category, updateMenuCategoryDto);

    return await this.menuCategoryRepository.save(category);
  }

  async remove(id: string, restaurantId: string): Promise<void> {
    const category = await this.findOne(id, restaurantId);
    await this.menuCategoryRepository.softDelete(id);
  }

  /**
   * Reorder categories by providing an array of IDs in the desired order
   */
  async reorder(restaurantId: string, categoryIds: string[]): Promise<MenuCategory[]> {
    // Verify all categories belong to this restaurant
    const categories = await this.menuCategoryRepository.find({
      where: { restaurantId },
    });

    const categoryMap = new Map(categories.map(c => [c.id, c]));

    // Validate that all provided IDs exist and belong to this restaurant
    for (const id of categoryIds) {
      if (!categoryMap.has(id)) {
        throw new NotFoundException(
          `Menu category with ID ${id} not found or does not belong to this restaurant`
        );
      }
    }

    // Update displayOrder for each category
    const updatePromises = categoryIds.map((id, index) => {
      const category = categoryMap.get(id);
      category.displayOrder = index;
      return this.menuCategoryRepository.save(category);
    });

    const updatedCategories = await Promise.all(updatePromises);

    return updatedCategories.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Toggle active status for a category
   */
  async toggleActive(id: string, restaurantId: string): Promise<MenuCategory> {
    const category = await this.findOne(id, restaurantId);
    category.isActive = !category.isActive;
    return await this.menuCategoryRepository.save(category);
  }
}
