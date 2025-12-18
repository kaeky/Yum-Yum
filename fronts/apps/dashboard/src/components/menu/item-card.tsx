'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@yumyum/ui';

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

interface ItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onToggleAvailability: (itemId: string) => void;
  onToggleActive: (itemId: string) => void;
}

export function ItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleActive,
}: ItemCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
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
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0"
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

        {/* Image (if exists) */}
        {item.image && (
          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="text-base font-semibold text-gray-900">{item.name}</h4>
                {item.isSpecial && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                    ⭐ Especial
                  </span>
                )}
                {!item.isActive && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    Inactivo
                  </span>
                )}
                {!item.isAvailable && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                    No disponible
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="font-semibold text-green-600 text-base">
                  ${Number(item.price).toFixed(2)}
                </span>
                {item.calories && <span>🔥 {item.calories} kcal</span>}
                {item.preparationTime && <span>⏱️ {item.preparationTime} min</span>}
              </div>

              {/* Dietary Info & Allergens */}
              {(item.dietaryInfo.length > 0 || item.allergens.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.dietaryInfo.map(info => (
                    <span
                      key={info}
                      className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded"
                    >
                      {info}
                    </span>
                  ))}
                  {item.allergens.length > 0 && (
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded">
                      ⚠️ {item.allergens.join(', ')}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => onToggleAvailability(item.id)}
                  className={`
                    px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap
                    ${
                      item.isAvailable
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }
                  `}
                  title={item.isAvailable ? 'Marcar como no disponible' : 'Marcar como disponible'}
                >
                  {item.isAvailable ? '✓ Disponible' : '✗ No Disponible'}
                </button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="flex-1">
                  Editar
                </Button>
                <button
                  onClick={() => onDelete(item.id)}
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
    </div>
  );
}
