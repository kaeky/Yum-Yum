'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Input, Badge } from '@yumyum/ui';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  capacity: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (filterCity) params.append('city', filterCity);
      if (filterCuisine) params.append('cuisine', filterCuisine);
      if (filterStatus !== 'all') {
        params.append('isActive', filterStatus === 'active' ? 'true' : 'false');
      }

      const response = await api.get(`/restaurants?${params.toString()}`);

      if (response.data.success) {
        setRestaurants(response.data.data.restaurants || []);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterCity, filterCuisine, filterStatus]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el restaurante "${name}"?`)) return;

    try {
      await api.delete(`/restaurants/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Error al eliminar el restaurante');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/restaurants/${id}`, {
        isActive: !currentStatus,
      });
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handleToggleVerified = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/restaurants/${id}`, {
        isVerified: !currentStatus,
      });
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('Error al actualizar la verificación');
    }
  };

  const cities = [...new Set(restaurants.map(r => r.city))];
  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando restaurantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurantes</h1>
          <p className="text-gray-600 mt-1">Gestiona todos los restaurantes del sistema</p>
        </div>
        <Link href="/dashboard/restaurants/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            + Nuevo Restaurante
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* City Filter */}
            <div>
              <select
                value={filterCity}
                onChange={e => setFilterCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Todas las ciudades</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Cuisine Filter */}
            <div>
              <select
                value={filterCuisine}
                onChange={e => setFilterCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Solo activos</option>
                <option value="inactive">Solo inactivos</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || filterCity || filterCuisine || filterStatus !== 'all') && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCity('');
                  setFilterCuisine('');
                  setFilterStatus('all');
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{restaurants.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Activos</p>
            <p className="text-3xl font-bold text-green-600">
              {restaurants.filter(r => r.isActive).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Verificados</p>
            <p className="text-3xl font-bold text-blue-600">
              {restaurants.filter(r => r.isVerified).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Rating Promedio</p>
            <p className="text-3xl font-bold text-yellow-600">
              {restaurants.length > 0
                ? (
                    restaurants.reduce((acc, r) => acc + Number(r.rating), 0) / restaurants.length
                  ).toFixed(1)
                : '0.0'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Restaurants List */}
      {restaurants.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay restaurantes</h3>
            <p className="text-gray-600 mb-4">
              Comienza creando tu primer restaurante en el sistema.
            </p>
            <Link href="/dashboard/restaurants/new">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                + Crear Restaurante
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {restaurants.map(restaurant => (
            <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                      {restaurant.isVerified && (
                        <Badge className="bg-blue-100 text-blue-700 border-0">✓ Verificado</Badge>
                      )}
                      {restaurant.isActive ? (
                        <Badge className="bg-green-100 text-green-700 border-0">Activo</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 border-0">Inactivo</Badge>
                      )}
                      {restaurant.isFeatured && (
                        <Badge className="bg-yellow-100 text-yellow-700 border-0">
                          ⭐ Destacado
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Tipo:</span> {restaurant.cuisine}
                      </div>
                      <div>
                        <span className="font-medium">Ciudad:</span> {restaurant.city},{' '}
                        {restaurant.state}
                      </div>
                      <div>
                        <span className="font-medium">Capacidad:</span> {restaurant.capacity}{' '}
                        personas
                      </div>
                      <div>
                        <span className="font-medium">Rating:</span> ⭐{' '}
                        {Number(restaurant.rating).toFixed(1)} ({restaurant.reviewCount})
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Owner:</span> {restaurant.owner.firstName}{' '}
                        {restaurant.owner.lastName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {restaurant.owner.email}
                      </div>
                      <div>
                        <span className="font-medium">Tel:</span> {restaurant.phone}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/dashboard/restaurants/${restaurant.id}/edit`}>
                      <Button size="sm" variant="outline" className="w-full">
                        ✏️ Editar
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(restaurant.id, restaurant.isActive)}
                      className="w-full"
                    >
                      {restaurant.isActive ? '🔴 Desactivar' : '🟢 Activar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleVerified(restaurant.id, restaurant.isVerified)}
                      className="w-full"
                    >
                      {restaurant.isVerified ? '✗ Desverificar' : '✓ Verificar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(restaurant.id, restaurant.name)}
                      className="w-full text-red-600 hover:bg-red-50"
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
