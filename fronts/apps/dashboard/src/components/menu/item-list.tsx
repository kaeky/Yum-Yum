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
import { ItemCard } from './item-card';

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

interface ItemListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onToggleAvailability: (itemId: string) => void;
  onToggleActive: (itemId: string) => void;
  onReorder: (items: MenuItem[]) => void;
}

export function ItemList({
  items,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleActive,
  onReorder,
}: ItemListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      // Update displayOrder
      const updated = newItems.map((item, index) => ({
        ...item,
        displayOrder: index,
      }));

      onReorder(updated);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleAvailability={onToggleAvailability}
              onToggleActive={onToggleActive}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
