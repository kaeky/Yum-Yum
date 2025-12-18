'use client';

import { useState, useEffect } from 'react';
import { Button } from '@yumyum/ui';
import { api } from '@/lib/api';
import { ItemsByCategory } from './items-by-category';
import { ItemFormModal } from './item-form-modal';

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

interface MenuItemsSectionProps {
  restaurantId: string;
}

export function MenuItemsSection({ restaurantId }: MenuItemsSectionProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemsRes] = await Promise.all([
        api.get(`/restaurants/${restaurantId}/menu-categories`),
        api.get(`/restaurants/${restaurantId}/menu-items`),
      ]);

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data.categories);
      }
      if (itemsRes.data.success) {
        setItems(itemsRes.data.data.items);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('¿Estás seguro de eliminar este platillo?')) return;

    try {
      await api.delete(`/restaurants/${restaurantId}/menu-items/${itemId}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error al eliminar el platillo');
    }
  };

  const handleToggleAvailability = async (itemId: string) => {
    try {
      await api.post(`/restaurants/${restaurantId}/menu-items/${itemId}/toggle-availability`);
      await fetchData();
    } catch (error) {
      console.error('Error toggling item availability:', error);
      alert('Error al cambiar la disponibilidad');
    }
  };

  const handleToggleActive = async (itemId: string) => {
    try {
      await api.post(`/restaurants/${restaurantId}/menu-items/${itemId}/toggle-active`);
      await fetchData();
    } catch (error) {
      console.error('Error toggling item status:', error);
      alert('Error al cambiar el estado');
    }
  };

  const handleReorder = async (categoryId: string, updatedItems: MenuItem[]) => {
    // Update UI optimistically
    setItems(prevItems => {
      const otherItems = prevItems.filter(item => item.categoryId !== categoryId);
      return [...otherItems, ...updatedItems];
    });

    try {
      const itemIds = updatedItems.map(item => item.id);
      await api.post(`/restaurants/${restaurantId}/menu-items/categories/${categoryId}/reorder`, {
        itemIds,
      });
    } catch (error) {
      console.error('Error reordering items:', error);
      // Revert on error
      await fetchData();
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await api.patch(`/restaurants/${restaurantId}/menu-items/${editingItem.id}`, data);
      } else {
        await api.post(`/restaurants/${restaurantId}/menu-items`, data);
      }
      await fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Primero crea categorías</h3>
          <p className="text-gray-600 mb-4">
            Necesitas crear al menos una categoría antes de añadir platillos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Platillos del Menú</h2>
          <p className="text-sm text-gray-600">
            {items.length} {items.length === 1 ? 'platillo' : 'platillos'} en {categories.length}{' '}
            {categories.length === 1 ? 'categoría' : 'categorías'}
          </p>
        </div>
        <Button onClick={handleCreate}>+ Nuevo Platillo</Button>
      </div>

      {/* Items by Category */}
      <ItemsByCategory
        categories={categories}
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleAvailability={handleToggleAvailability}
        onToggleActive={handleToggleActive}
        onReorder={handleReorder}
      />

      {/* Modal */}
      {showModal && (
        <ItemFormModal
          item={editingItem}
          categories={categories}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
