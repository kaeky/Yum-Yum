'use client';

import { useState, useEffect } from 'react';
import { Button } from '@yumyum/ui';
import { api } from '@/lib/api';
import { CategoryList } from './category-list';
import { CategoryFormModal } from './category-form-modal';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  image?: string;
  items?: any[];
}

interface MenuCategoriesSectionProps {
  restaurantId: string;
}

export function MenuCategoriesSection({ restaurantId }: MenuCategoriesSectionProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/${restaurantId}/menu-categories`);
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [restaurantId]);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await api.delete(`/restaurants/${restaurantId}/menu-categories/${categoryId}`);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría');
    }
  };

  const handleToggleActive = async (categoryId: string) => {
    try {
      await api.post(`/restaurants/${restaurantId}/menu-categories/${categoryId}/toggle-active`);
      await fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert('Error al cambiar el estado de la categoría');
    }
  };

  const handleReorder = async (updatedCategories: MenuCategory[]) => {
    // Update UI optimistically
    setCategories(updatedCategories);

    try {
      const categoryIds = updatedCategories.map(c => c.id);
      await api.post(`/restaurants/${restaurantId}/menu-categories/reorder`, {
        categoryIds,
      });
    } catch (error) {
      console.error('Error reordering categories:', error);
      // Revert on error
      await fetchCategories();
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingCategory) {
        await api.patch(`/restaurants/${restaurantId}/menu-categories/${editingCategory.id}`, data);
      } else {
        await api.post(`/restaurants/${restaurantId}/menu-categories`, data);
      }
      await fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Categorías del Menú</h2>
          <p className="text-sm text-gray-600">
            {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}
          </p>
        </div>
        <Button onClick={handleCreate}>+ Nueva Categoría</Button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorías</h3>
          <p className="text-gray-600 mb-4">Comienza creando tu primera categoría de menú</p>
          <Button onClick={handleCreate}>Crear Primera Categoría</Button>
        </div>
      ) : (
        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onReorder={handleReorder}
        />
      )}

      {/* Modal */}
      {showModal && (
        <CategoryFormModal
          category={editingCategory}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
