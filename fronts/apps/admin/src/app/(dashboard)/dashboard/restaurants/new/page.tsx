'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@yumyum/ui';
import { api } from '@/lib/api';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function NewRestaurantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [owners, setOwners] = useState<User[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    cuisine: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    capacity: '',
    description: '',
    ownerId: '',
    isActive: true,
    isVerified: false,
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    // Auto-generate slug from name
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);

  const fetchOwners = async () => {
    try {
      setLoadingOwners(true);
      // Endpoint para obtener usuarios con rol restaurant_owner
      const response = await api.get('/users?role=restaurant_owner');
      if (response.data.success) {
        setOwners(response.data.data.users || []);
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
    } finally {
      setLoadingOwners(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity),
      };

      await api.post('/restaurants', payload);
      router.push('/dashboard/restaurants');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el restaurante');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/restaurants">
          <Button variant="outline">← Volver</Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Restaurante</h1>
          <p className="text-gray-600">Crea un nuevo restaurante en el sistema</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Restaurante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="slug">
                    Slug (URL) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="nombre-restaurante"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: {formData.slug || 'nombre-restaurante'}.yumyum.com
                  </p>
                </div>

                <div>
                  <Label htmlFor="cuisine">
                    Tipo de Cocina <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cuisine"
                    value={formData.cuisine}
                    onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="Italiana, Mexicana, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">
                    Capacidad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    disabled={loading}
                    min="1"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                  disabled={loading}
                  placeholder="Describe el restaurante..."
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">
                    Teléfono <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="+34 915 123 456"
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="info@restaurante.com"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Dirección</h3>

              <div>
                <Label htmlFor="address">
                  Calle y Número <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="Calle Gran Vía, 25"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">
                    Ciudad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="state">
                    Estado/Provincia <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="country">
                    País <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">
                    Código Postal <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Owner */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Propietario</h3>

              <div>
                <Label htmlFor="ownerId">
                  Seleccionar Propietario <span className="text-red-500">*</span>
                </Label>
                {loadingOwners ? (
                  <p className="text-sm text-gray-500">Cargando propietarios...</p>
                ) : (
                  <select
                    id="ownerId"
                    value={formData.ownerId}
                    onChange={e => setFormData({ ...formData, ownerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    disabled={loading}
                  >
                    <option value="">Selecciona un propietario</option>
                    {owners.map(owner => (
                      <option key={owner.id} value={owner.id}>
                        {owner.firstName} {owner.lastName} - {owner.email}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  El propietario podrá gestionar este restaurante desde su dashboard
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Estado</h3>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium text-gray-700">Activo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={e => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium text-gray-700">Verificado</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Link href="/dashboard/restaurants" className="flex-1">
                <Button type="button" variant="outline" className="w-full" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Restaurante'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
