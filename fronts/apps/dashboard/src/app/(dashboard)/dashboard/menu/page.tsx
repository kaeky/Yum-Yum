'use client';

import { useState, useEffect } from 'react';
import { Button } from '@yumyum/ui';
import { api } from '@/lib/api';
import { MenuCategoriesSection } from '@/components/menu/menu-categories-section';
import { MenuItemsSection } from '@/components/menu/menu-items-section';

type Tab = 'categories' | 'items';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Get selected restaurant from context or localStorage
    // For now, fetch the first restaurant
    const fetchRestaurant = async () => {
      try {
        const response = await api.get('/restaurants/my-restaurants');
        if (response.data.success && response.data.data.restaurants.length > 0) {
          setRestaurantId(response.data.data.restaurants[0].id);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">No tienes restaurantes</h2>
          <p className="text-yellow-700 mb-4">
            Necesitas crear un restaurante antes de gestionar el menú.
          </p>
          <Button asChild>
            <a href="/dashboard/restaurants/new">Crear Restaurante</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Menú</h1>
        <p className="text-gray-600">Administra las categorías y platillos de tu menú</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('categories')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'categories'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              📁 Categorías
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'items'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              🍽️ Platillos
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'categories' && <MenuCategoriesSection restaurantId={restaurantId} />}
        {activeTab === 'items' && <MenuItemsSection restaurantId={restaurantId} />}
      </div>
    </div>
  );
}
