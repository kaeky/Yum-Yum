'use client';

import { useState, useEffect } from 'react';
import { Button } from '@yumyum/ui';
import { api } from '@/lib/api';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  capacity: number;
  description?: string;
}

interface GeneralSettingsSectionProps {
  restaurantId: string;
}

export function GeneralSettingsSection({ restaurantId }: GeneralSettingsSectionProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState<Partial<Restaurant>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/${restaurantId}`);
      if (response.data.success) {
        const data = response.data.data.restaurant;
        setRestaurant(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setError('Error al cargar la información del restaurante');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await api.patch(`/restaurants/${restaurantId}`, formData);
      setSuccess('Cambios guardados exitosamente');
      await fetchRestaurant();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Información General</h2>
        <p className="text-sm text-gray-600">Información básica de tu restaurante</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Restaurante <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name || ''}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            required
            disabled={saving}
          />
        </div>

        {/* Cuisine */}
        <div>
          <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Cocina <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cuisine"
            value={formData.cuisine || ''}
            onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Ej: Italiana, Mexicana, Japonesa"
            required
            disabled={saving}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone || ''}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="+34 915 123 456"
            required
            disabled={saving}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email || ''}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="contacto@restaurante.com"
            required
            disabled={saving}
          />
        </div>

        {/* Capacity */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
            Capacidad Total <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="capacity"
            value={formData.capacity || ''}
            onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="50"
            min="1"
            required
            disabled={saving}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
          placeholder="Describe tu restaurante..."
          rows={4}
          maxLength={1000}
          disabled={saving}
        />
        <p className="text-xs text-gray-500 mt-1">
          {(formData.description || '').length}/1000 caracteres
        </p>
      </div>

      {/* Address Section */}
      <div className="border-t pt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Dirección</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Calle y Número <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              value={formData.address || ''}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Calle Principal, 123"
              required
              disabled={saving}
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              value={formData.city || ''}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
              disabled={saving}
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              Estado/Provincia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="state"
              value={formData.state || ''}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
              disabled={saving}
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              País <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="country"
              value={formData.country || ''}
              onChange={e => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
              disabled={saving}
            />
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Código Postal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode || ''}
              onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
              disabled={saving}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData(restaurant || {});
            setError('');
            setSuccess('');
          }}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}
