'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@yumyum/ui';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  image?: string;
  items?: any[];
}

interface CategoryCardProps {
  category: MenuCategory;
  onEdit: (category: MenuCategory) => void;
  onDelete: (categoryId: string) => void;
  onToggleActive: (categoryId: string) => void;
}

export function CategoryCard({ category, onEdit, onDelete, onToggleActive }: CategoryCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="7" r="1" />
            <circle cx="15" cy="7" r="1" />
            <circle cx="9" cy="12" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="9" cy="17" r="1" />
            <circle cx="15" cy="17" r="1" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                <span className="text-xs text-gray-500">#{category.displayOrder}</span>
                {!category.isActive && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    Inactiva
                  </span>
                )}
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
              )}
              {category.items && (
                <p className="text-xs text-gray-500 mt-2">
                  {category.items.length} {category.items.length === 1 ? 'platillo' : 'platillos'}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleActive(category.id)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded transition-colors
                  ${
                    category.isActive
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {category.isActive ? '✓ Activa' : '○ Inactiva'}
              </button>
              <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                Editar
              </Button>
              <button
                onClick={() => onDelete(category.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Eliminar"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
