'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CategoryCard } from './category-card';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  image?: string;
  items?: any[];
}

interface CategoryListProps {
  categories: MenuCategory[];
  onEdit: (category: MenuCategory) => void;
  onDelete: (categoryId: string) => void;
  onToggleActive: (categoryId: string) => void;
  onReorder: (categories: MenuCategory[]) => void;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
}: CategoryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex(c => c.id === active.id);
      const newIndex = categories.findIndex(c => c.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);
      // Update displayOrder
      const updated = newCategories.map((cat, index) => ({
        ...cat,
        displayOrder: index,
      }));

      onReorder(updated);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
