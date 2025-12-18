'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { GeneralSettingsSection } from '@/components/settings/general-settings-section';
import { OpeningHoursSection } from '@/components/settings/opening-hours-section';
import { ThemeSettingsSection } from '@/components/settings/theme-settings-section';
import { PaymentSettingsSection } from '@/components/settings/payment-settings-section';

type Tab = 'general' | 'hours' | 'theme' | 'payment';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
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
          <p className="text-yellow-700">
            Necesitas crear un restaurante antes de acceder a la configuración.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general' as Tab, name: 'General', icon: '📋' },
    { id: 'hours' as Tab, name: 'Horarios', icon: '🕐' },
    { id: 'theme' as Tab, name: 'Tema', icon: '🎨' },
    { id: 'payment' as Tab, name: 'Pagos', icon: '💳' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-600">Administra la configuración de tu restaurante</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                  ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'general' && <GeneralSettingsSection restaurantId={restaurantId} />}
        {activeTab === 'hours' && <OpeningHoursSection restaurantId={restaurantId} />}
        {activeTab === 'theme' && <ThemeSettingsSection restaurantId={restaurantId} />}
        {activeTab === 'payment' && <PaymentSettingsSection restaurantId={restaurantId} />}
      </div>
    </div>
  );
}
