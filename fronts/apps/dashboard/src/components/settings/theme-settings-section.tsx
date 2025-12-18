'use client';

import { useState, useEffect } from 'react';
import { Button } from '@yumyum/ui';
import { api } from '@/lib/api';

interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
  heroImage?: string;
  fontFamily?: string;
}

interface ThemeSettingsSectionProps {
  restaurantId: string;
}

export function ThemeSettingsSection({ restaurantId }: ThemeSettingsSectionProps) {
  const [theme, setTheme] = useState<ThemeSettings>({
    primaryColor: '#0ea5e9', // sky-500
    secondaryColor: '#06b6d4', // cyan-500
    logo: '',
    heroImage: '',
    fontFamily: 'Inter',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTheme();
  }, [restaurantId]);

  const fetchTheme = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/${restaurantId}`);
      if (response.data.success) {
        const restaurant = response.data.data.restaurant;
        const restaurantTheme = restaurant.settings?.theme || {};
        setTheme({
          primaryColor: restaurantTheme.primaryColor || '#0ea5e9',
          secondaryColor: restaurantTheme.secondaryColor || '#06b6d4',
          logo: restaurant.logo || '',
          heroImage: restaurant.coverImage || '',
          fontFamily: restaurantTheme.fontFamily || 'Inter',
        });
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
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
      // First, get current settings to merge with theme
      const response = await api.get(`/restaurants/${restaurantId}`);
      const currentSettings = response.data.data.restaurant.settings || {};

      // Update restaurant with theme in settings and logo/coverImage at top level
      await api.patch(`/restaurants/${restaurantId}`, {
        logo: theme.logo || null,
        coverImage: theme.heroImage || null,
        settings: {
          ...currentSettings,
          theme: {
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            fontFamily: theme.fontFamily,
          },
        },
      });
      setSuccess('Tema actualizado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el tema');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const presetColors = [
    { name: 'Sky Blue', value: '#0ea5e9' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
  ];

  return (
    <form onSubmit={handleSave} className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Personalización de Tema</h2>
        <p className="text-sm text-gray-600">Personaliza la apariencia de tu página de reservas</p>
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

      {/* Primary Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color Principal</label>
        <div className="flex items-center gap-4 mb-3">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
            className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
            disabled={saving}
          />
          <input
            type="text"
            value={theme.primaryColor}
            onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="#0ea5e9"
            disabled={saving}
          />
        </div>
        <div className="flex gap-2">
          {presetColors.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => setTheme({ ...theme, primaryColor: color.value })}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color.value }}
              title={color.name}
              disabled={saving}
            />
          ))}
        </div>
      </div>

      {/* Secondary Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color Secundario</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.secondaryColor}
            onChange={e => setTheme({ ...theme, secondaryColor: e.target.value })}
            className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
            disabled={saving}
          />
          <input
            type="text"
            value={theme.secondaryColor}
            onChange={e => setTheme({ ...theme, secondaryColor: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="#06b6d4"
            disabled={saving}
          />
        </div>
      </div>

      {/* Logo URL */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
          Logo URL (opcional)
        </label>
        <input
          type="url"
          id="logo"
          value={theme.logo || ''}
          onChange={e => setTheme({ ...theme, logo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          placeholder="https://ejemplo.com/logo.png"
          disabled={saving}
        />
        {theme.logo && (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg inline-block">
            <img src={theme.logo} alt="Logo preview" className="h-12 object-contain" />
          </div>
        )}
      </div>

      {/* Hero Image URL */}
      <div>
        <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-1">
          Imagen de Portada URL (opcional)
        </label>
        <input
          type="url"
          id="heroImage"
          value={theme.heroImage || ''}
          onChange={e => setTheme({ ...theme, heroImage: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          placeholder="https://ejemplo.com/hero.jpg"
          disabled={saving}
        />
        {theme.heroImage && (
          <div className="mt-2 rounded-lg overflow-hidden">
            <img src={theme.heroImage} alt="Hero preview" className="w-full h-32 object-cover" />
          </div>
        )}
      </div>

      {/* Font Family */}
      <div>
        <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-1">
          Fuente Tipográfica
        </label>
        <select
          id="fontFamily"
          value={theme.fontFamily}
          onChange={e => setTheme({ ...theme, fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          disabled={saving}
        >
          <option value="Inter">Inter (por defecto)</option>
          <option value="Poppins">Poppins</option>
          <option value="Roboto">Roboto</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Playfair Display">Playfair Display (elegante)</option>
        </select>
      </div>

      {/* Preview */}
      <div className="border-t pt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Vista Previa</h3>
        <div
          className="p-6 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
          }}
        >
          <div className="text-white text-center">
            <h4 className="text-2xl font-bold mb-2" style={{ fontFamily: theme.fontFamily }}>
              Restaurante Demo
            </h4>
            <p className="text-white/90" style={{ fontFamily: theme.fontFamily }}>
              Así se verá tu página de reservas
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            fetchTheme();
            setError('');
            setSuccess('');
          }}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Tema'}
        </Button>
      </div>
    </form>
  );
}
