'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@yumyum/ui';
import Link from 'next/link';

interface FormData {
  name: string;
  description: string;
  cuisine: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  maxPartySize: string;
  priceRange: string;
  amenities: string;
}

export default function NewRestaurantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    cuisine: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    maxPartySize: '12',
    priceRange: '$$',
    amenities: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        maxPartySize: parseInt(formData.maxPartySize),
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
      };

      const response = await api.post('/restaurants', payload);

      if (response.data.success) {
        router.push('/dashboard/restaurants');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear restaurante');
      console.error('Error creating restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Restaurante</h1>
          <p className="text-gray-600 mt-1">Completa la información de tu restaurante</p>
        </div>
        <Link href="/dashboard/restaurants">
          <Button variant="outline">← Volver</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nombre del Restaurante *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="La Parrilla Gourmet"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Descripción *</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Describe tu restaurante, su especialidad y lo que lo hace único..."
                />
              </div>

              <div>
                <Label htmlFor="cuisine">Tipo de Cocina *</Label>
                <Input
                  id="cuisine"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  required
                  placeholder="Italiana, Mexicana, etc."
                />
              </div>

              <div>
                <Label htmlFor="priceRange">Rango de Precio *</Label>
                <select
                  id="priceRange"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={(e: any) => handleChange(e)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="$">$ - Económico</option>
                  <option value="$$">$$ - Moderado</option>
                  <option value="$$$">$$$ - Caro</option>
                  <option value="$$$$">$$$$ - Muy Caro</option>
                </select>
              </div>

              <div>
                <Label htmlFor="maxPartySize">Tamaño Máximo de Grupo *</Label>
                <Input
                  id="maxPartySize"
                  name="maxPartySize"
                  type="number"
                  value={formData.maxPartySize}
                  onChange={handleChange}
                  required
                  min="1"
                  max="50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="contacto@restaurante.com"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="website">Sitio Web (opcional)</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.mirestaurante.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Dirección Completa *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Calle 123 #45-67"
                />
              </div>

              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Bogotá"
                />
              </div>

              <div>
                <Label htmlFor="zipCode">Código Postal (opcional)</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="110111"
                />
              </div>

              <div>
                <Label htmlFor="latitude">Latitud (opcional)</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="4.6097"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitud (opcional)</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="-74.0817"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenidades */}
        <Card>
          <CardHeader>
            <CardTitle>Amenidades</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="amenities">Amenidades (separadas por comas)</Label>
            <Input
              id="amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Estacionamiento, Terraza, Aire Acondicionado"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ejemplo: WiFi, Estacionamiento, Terraza, Aire Acondicionado
            </p>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end space-x-4">
          <Link href="/dashboard/restaurants">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Restaurante'}
          </Button>
        </div>
      </form>
    </div>
  );
}
