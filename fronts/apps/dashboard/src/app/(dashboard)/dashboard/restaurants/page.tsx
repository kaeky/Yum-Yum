'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@yumyum/ui';
import Link from 'next/link';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  images: string[];
}

export default function RestaurantsPage() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyRestaurants();
  }, []);

  const fetchMyRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/restaurants/my-restaurants');

      if (response.data.success) {
        setRestaurants(response.data.data.restaurants);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar restaurantes');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/restaurants/${id}`, {
        isActive: !currentStatus,
      });

      // Actualizar localmente
      setRestaurants(restaurants.map(r => (r.id === id ? { ...r, isActive: !currentStatus } : r)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar restaurante');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando restaurantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Restaurantes</h1>
          <p className="text-gray-600 mt-1">Gestiona tus restaurantes y configura sus opciones</p>
        </div>
        <Link href="/dashboard/restaurants/new">
          <Button size="lg">
            <span className="mr-2">+</span>
            Nuevo Restaurante
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Restaurants Grid */}
      {restaurants.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes restaurantes registrados
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer restaurante para empezar a recibir reservas
            </p>
            <Link href="/dashboard/restaurants/new">
              <Button size="lg">Crear Mi Primer Restaurante</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{restaurant.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {restaurant.cuisine} • {restaurant.city}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={restaurant.isActive ? 'default' : 'outline'}
                    onClick={() => toggleActive(restaurant.id, restaurant.isActive)}
                  >
                    {restaurant.isActive ? '🟢' : '🔴'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{restaurant.description}</p>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium">{Number(restaurant.rating).toFixed(1)}</span>
                    <span className="text-gray-500">({restaurant.reviewCount})</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center space-x-2 mb-4">
                  {restaurant.isVerified && (
                    <Badge variant="success" className="text-xs">
                      ✓ Verificado
                    </Badge>
                  )}
                  {restaurant.isFeatured && (
                    <Badge variant="default" className="text-xs">
                      ⭐ Destacado
                    </Badge>
                  )}
                  {!restaurant.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Inactivo
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link href={`/dashboard/restaurants/${restaurant.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalles
                    </Button>
                  </Link>
                  <Link href={`/dashboard/restaurants/${restaurant.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      ✏️
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Restaurantes</p>
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
      )}
    </div>
  );
}
