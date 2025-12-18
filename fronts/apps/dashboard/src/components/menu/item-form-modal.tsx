'use client';

import { useState, useEffect } from 'react';
import { Button } from '@yumyum/ui';

interface MenuCategory {
  id: string;
  name: string;
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
  isSpecial: boolean;
}

interface ItemFormModalProps {
  item: MenuItem | null;
  categories: MenuCategory[];
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

const DIETARY_OPTIONS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'spicy',
  'keto',
  'halal',
  'kosher',
];

const COMMON_ALLERGENS = [
  'gluten',
  'dairy',
  'eggs',
  'nuts',
  'peanuts',
  'soy',
  'fish',
  'shellfish',
  'sesame',
];

export function ItemFormModal({ item, categories, onSave, onClose }: ItemFormModalProps) {
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    image: '',
    calories: '',
    preparationTime: '',
    isAvailable: true,
    isSpecial: false,
    dietaryInfo: [] as string[],
    allergens: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        categoryId: item.categoryId,
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        image: item.image || '',
        calories: item.calories?.toString() || '',
        preparationTime: item.preparationTime?.toString() || '',
        isAvailable: item.isAvailable,
        isSpecial: item.isSpecial,
        dietaryInfo: item.dietaryInfo || [],
        allergens: item.allergens || [],
      });
    } else if (categories.length > 0) {
      setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [item, categories]);

  const toggleDietaryInfo = (info: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryInfo: prev.dietaryInfo.includes(info)
        ? prev.dietaryInfo.filter(i => i !== info)
        : [...prev.dietaryInfo, info],
    }));
  };

  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      setError('El precio es requerido y debe ser mayor o igual a 0');
      return;
    }
    if (!formData.categoryId) {
      setError('Debes seleccionar una categoría');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        categoryId: formData.categoryId,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        image: formData.image.trim() || undefined,
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
        isAvailable: formData.isAvailable,
        isSpecial: formData.isSpecial,
        dietaryInfo: formData.dietaryInfo,
        allergens: formData.allergens,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {item ? 'Editar Platillo' : 'Nuevo Platillo'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {item ? 'Modifica los detalles del platillo' : 'Añade un nuevo platillo a tu menú'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Ej: Pizza Margherita"
                maxLength={255}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Describe el platillo..."
              rows={3}
              maxLength={500}
              disabled={loading}
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              URL de Imagen (opcional)
            </label>
            <input
              type="url"
              id="image"
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
              disabled={loading}
            />
          </div>

          {/* Calories & Prep Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                Calorías (opcional)
              </label>
              <input
                type="number"
                id="calories"
                value={formData.calories}
                onChange={e => setFormData({ ...formData, calories: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Ej: 450"
                min="0"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="preparationTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tiempo de Preparación (min)
              </label>
              <input
                type="number"
                id="preparationTime"
                value={formData.preparationTime}
                onChange={e => setFormData({ ...formData, preparationTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Ej: 15"
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          {/* Dietary Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información Dietética
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleDietaryInfo(option)}
                  className={`
                    px-3 py-1.5 text-sm rounded-lg border transition-colors
                    ${
                      formData.dietaryInfo.includes(option)
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  disabled={loading}
                >
                  {formData.dietaryInfo.includes(option) && '✓ '}
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alérgenos</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_ALLERGENS.map(allergen => (
                <button
                  key={allergen}
                  type="button"
                  onClick={() => toggleAllergen(allergen)}
                  className={`
                    px-3 py-1.5 text-sm rounded-lg border transition-colors
                    ${
                      formData.allergens.includes(allergen)
                        ? 'bg-orange-50 border-orange-300 text-orange-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  disabled={loading}
                >
                  {formData.allergens.includes(allergen) && '⚠️ '}
                  {allergen}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">Disponible para ordenar</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isSpecial}
                onChange={e => setFormData({ ...formData, isSpecial: e.target.checked })}
                className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">Platillo especial / destacado</span>
            </label>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? 'Guardando...' : item ? 'Guardar Cambios' : 'Crear Platillo'}
          </Button>
        </div>
      </div>
    </div>
  );
}
