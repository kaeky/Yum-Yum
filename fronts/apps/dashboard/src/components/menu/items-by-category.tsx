'use client';

import { ItemList } from './item-list';

interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  allergens: string[];
  dietaryInfo: string[];
  calories?: number;
  preparationTime?: number;
  isAvailable: boolean;
  isActive: boolean;
  isSpecial: boolean;
  displayOrder: number;
}

interface ItemsByCategoryProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onToggleAvailability: (itemId: string) => void;
  onToggleActive: (itemId: string) => void;
  onReorder: (categoryId: string, items: MenuItem[]) => void;
}

export function ItemsByCategory({
  categories,
  items,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleActive,
  onReorder,
}: ItemsByCategoryProps) {
  // Sort categories by displayOrder
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      {sortedCategories.map(category => {
        const categoryItems = items
          .filter(item => item.categoryId === category.id)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return (
          <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Category Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  {!category.isActive && (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                      Categoría inactiva
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {categoryItems.length} {categoryItems.length === 1 ? 'platillo' : 'platillos'}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="p-4">
              {categoryItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No hay platillos en esta categoría
                </div>
              ) : (
                <ItemList
                  items={categoryItems}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleAvailability={onToggleAvailability}
                  onToggleActive={onToggleActive}
                  onReorder={updatedItems => onReorder(category.id, updatedItems)}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
