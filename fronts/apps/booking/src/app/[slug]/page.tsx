'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Badge, Card, CardContent } from '@yumyum/ui';
import api from '@/lib/api';
import Link from 'next/link';
import { ReservationForm } from '@/components/reservation-form';

interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

interface RestaurantSettings {
  theme?: ThemeSettings;
  [key: string]: any;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  capacity: number;
  images: string[];
  coverImage?: string;
  logo?: string;
  openingHours?: any;
  settings?: RestaurantSettings;
  isActive: boolean;
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchRestaurant();
    }
  }, [slug]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/slug/${slug}`);

      if (response.data.success) {
        setRestaurant(response.data.data.restaurant);
      }
    } catch (err: any) {
      console.error('Error fetching restaurant:', err);
      setError('No se pudo cargar el restaurante');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando restaurante...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurante no encontrado</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Apply theme from settings
  const theme = restaurant.settings?.theme || {};
  const primaryColor = theme.primaryColor || '#f97316'; // orange-500
  const secondaryColor = theme.secondaryColor || '#fb923c'; // orange-400
  const fontFamily = theme.fontFamily || 'Inter';

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily }}>
      {/* Hero Section with Theme */}
      <div
        className="relative h-96 bg-gradient-to-br"
        style={{
          background: restaurant.coverImage
            ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${restaurant.coverImage})`
            : `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <Button variant="outline" className="bg-white/90 backdrop-blur-sm">
              ← Volver
            </Button>
          </Link>
        </div>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-end gap-6">
              {/* Logo */}
              {restaurant.logo && (
                <div className="w-24 h-24 bg-white rounded-xl shadow-2xl p-2 flex items-center justify-center">
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span>🍽️</span>
                    {restaurant.cuisine}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⭐</span>
                    {Number(restaurant.rating).toFixed(1)} ({restaurant.reviewCount} reseñas)
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💰</span>
                    {restaurant.priceRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    {restaurant.city}
                  </span>
                </div>
              </div>

              {/* CTA Button with theme color */}
              <Button
                size="lg"
                style={{ backgroundColor: primaryColor }}
                className="text-white hover:opacity-90"
                onClick={() => setShowReservationForm(true)}
              >
                Reservar Ahora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reservation Form */}
            {showReservationForm && (
              <div id="reservation-form">
                <ReservationForm
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                  maxPartySize={restaurant.settings?.maxPartySize || 12}
                  onSuccess={reservation => {
                    // Navigate to confirmation page
                    router.push(`/reservation/${reservation.id}`);
                  }}
                />
              </div>
            )}
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre el restaurante</h2>
                <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            {restaurant.openingHours && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Horarios</h2>
                  <div className="space-y-2">
                    {Object.entries(restaurant.openingHours).map(([day, hours]: [string, any]) => (
                      <div key={day} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700 capitalize">{day}</span>
                        {hours.closed ? (
                          <span className="text-red-600">Cerrado</span>
                        ) : (
                          <span className="text-gray-600">
                            {hours.open} - {hours.close}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Información de Contacto</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500">📞</span>
                    <a href={`tel:${restaurant.phone}`} className="text-gray-700 hover:underline">
                      {restaurant.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500">✉️</span>
                    <a
                      href={`mailto:${restaurant.email}`}
                      className="text-gray-700 hover:underline"
                    >
                      {restaurant.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500">📍</span>
                    <div className="text-gray-700">
                      {restaurant.address}
                      <br />
                      {restaurant.city}, {restaurant.state}
                      <br />
                      {restaurant.postalCode}, {restaurant.country}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">Capacidad</h3>
                <p className="text-3xl font-bold" style={{ color: primaryColor }}>
                  {restaurant.capacity}
                </p>
                <p className="text-sm text-gray-600">personas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Reserve Button (Mobile) */}
      {!showReservationForm && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <Button
            size="lg"
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
            onClick={() => {
              setShowReservationForm(true);
              // Scroll to form
              setTimeout(() => {
                document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Reservar Ahora
          </Button>
        </div>
      )}
    </div>
  );
}
