'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, Input, Badge } from '@yumyum/ui';
import RestaurantCard from '@/components/restaurant-card';
import api from '@/lib/api';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCity, selectedCuisine]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        fetchRestaurants();
      } else if (selectedCity === '' && selectedCuisine === '') {
        fetchRestaurants();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCity) params.append('city', selectedCity);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/restaurants?${params.toString()}`);

      if (response.data.success) {
        const restaurantData = response.data.data.restaurants;
        setRestaurants(restaurantData);

        // Extract unique cities and cuisines for filters
        if (!selectedCity && !selectedCuisine && !searchTerm) {
          const uniqueCities = [...new Set(restaurantData.map((r: Restaurant) => r.city))];
          const uniqueCuisines = [...new Set(restaurantData.map((r: Restaurant) => r.cuisine))];

          setCities(uniqueCities as string[]);
          setCuisines(uniqueCuisines as string[]);
        }
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedCuisine('');
    setSearchTerm('');
  };

  const featuredRestaurants = restaurants.filter(r => r.isFeatured);
  const hasFilters = selectedCity || selectedCuisine || searchTerm;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Header */}
      <header className="border-b border-orange-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                Y
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  YumYum
                </h1>
                <p className="text-xs text-gray-600">Descubre y Reserva</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost">Registrarse</Button>
              <Button variant="outline">Iniciar Sesión</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-sm mb-6 border border-orange-200">
              <span className="text-2xl mr-2">✨</span>
              <span className="text-sm font-medium text-gray-700">
                {restaurants.length} restaurantes disponibles
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Descubre los mejores
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                restaurantes cerca de ti
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explora, compara y reserva en los restaurantes más populares. Tu mesa perfecta te
              espera.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Buscar restaurante
                </label>
                <Input
                  type="text"
                  placeholder="Nombre o tipo de cocina"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📍 Ciudad</label>
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Todas las ciudades</option>
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🍴 Cocina</label>
                <select
                  value={selectedCuisine}
                  onChange={e => setSelectedCuisine(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Todas las cocinas</option>
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Filtros activos:</span>
                  {selectedCity && <Badge variant="secondary">{selectedCity}</Badge>}
                  {selectedCuisine && <Badge variant="secondary">{selectedCuisine}</Badge>}
                  {searchTerm && <Badge variant="secondary">{searchTerm}</Badge>}
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && !hasFilters && (
        <section className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>⭐</span>
              <span>Restaurantes Destacados</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.slice(0, 3).map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Restaurants */}
      <section className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {hasFilters ? 'Resultados de Búsqueda' : 'Todos los Restaurantes'}
            </h2>
            <span className="text-gray-600">
              {restaurants.length} {restaurants.length === 1 ? 'restaurante' : 'restaurantes'}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Cargando restaurantes...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No se encontraron restaurantes
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta ajustar tus filtros o buscar algo diferente
              </p>
              {hasFilters && <Button onClick={clearFilters}>Limpiar filtros</Button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {!hasFilters && (
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              ¿Por qué elegir YumYum?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '📅',
                  title: 'Reservas Fáciles',
                  description: 'Reserva tu mesa en segundos, confirmación instantánea',
                },
                {
                  icon: '🍽️',
                  title: 'Menú Digital',
                  description: 'Explora el menú completo con fotos y precios',
                },
                {
                  icon: '🥂',
                  title: 'Pre-Orden',
                  description: 'Ordena tus entradas y bebidas antes de llegar',
                },
                {
                  icon: '📱',
                  title: 'QR para Ordenar',
                  description: 'Ordena desde tu mesa escaneando el código QR',
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-orange-100 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-600 to-yellow-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">¿Tienes un restaurante?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a YumYum y lleva tu negocio al siguiente nivel
          </p>
          <Link href="https://dashboard.yumyum.com/register">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              Registra tu Restaurante
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2025 YumYum. Todos los derechos reservados.</p>
            <p className="mt-2">Hecho con ❤️ para los amantes de la buena comida</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
