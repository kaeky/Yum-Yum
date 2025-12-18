'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@yumyum/ui';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  images: string[];
  openingHours?: any;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
  };
  settings?: {
    acceptsReservations?: boolean;
    acceptsPreOrders?: boolean;
    acceptsTableOrders?: boolean;
    maxPartySize?: number;
    averageDuration?: number;
    depositRequired?: boolean;
    depositAmount?: number;
  };
}

interface RestaurantViewProps {
  restaurant: Restaurant;
}

export default function RestaurantView({ restaurant }: RestaurantViewProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [selectedTime, setSelectedTime] = useState('');

  const primaryColor = restaurant.theme?.primaryColor || '#f97316'; // orange-500
  const secondaryColor = restaurant.theme?.secondaryColor || '#fbbf24'; // yellow-400

  const handleReservation = () => {
    // TODO: Implement reservation logic
    console.log('Reservation:', { selectedDate, partySize, selectedTime });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with custom theme */}
      <header
        className="text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {restaurant.theme?.logo ? (
                <img
                  src={restaurant.theme.logo}
                  alt={restaurant.name}
                  className="h-16 w-16 rounded-lg bg-white p-2"
                />
              ) : (
                <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-800">
                  {restaurant.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                <p className="text-sm opacity-90">
                  {restaurant.cuisine} • {restaurant.city}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span className="text-2xl font-bold">{restaurant.rating.toFixed(1)}</span>
              <span className="text-sm opacity-90">({restaurant.reviewCount} reseñas)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {restaurant.images && restaurant.images.length > 0 && (
        <div className="h-96 overflow-hidden">
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Acerca de {restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{restaurant.cuisine}</Badge>
                  <Badge variant="secondary">{restaurant.priceRange}</Badge>
                  {restaurant.settings?.acceptsReservations && (
                    <Badge variant="secondary">📅 Acepta Reservas</Badge>
                  )}
                  {restaurant.settings?.acceptsPreOrders && (
                    <Badge variant="secondary">🍽️ Pre-Orden</Badge>
                  )}
                  {restaurant.settings?.acceptsTableOrders && (
                    <Badge variant="secondary">📱 Orden desde Mesa</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-medium">Dirección</p>
                    <p className="text-sm text-gray-600">
                      {restaurant.address}, {restaurant.city}, {restaurant.state}{' '}
                      {restaurant.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">✉️</span>
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={`mailto:${restaurant.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {restaurant.email}
                    </a>
                  </div>
                </div>
                {restaurant.website && (
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">🌐</span>
                    <div>
                      <p className="font-medium">Sitio Web</p>
                      <a
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {restaurant.website}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Opening Hours */}
            {restaurant.openingHours && (
              <Card>
                <CardHeader>
                  <CardTitle>Horarios de Atención</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(restaurant.openingHours).map(([day, hours]: [string, any]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-gray-600">
                          {hours.closed ? 'Cerrado' : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Reservation Form */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Haz tu Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {restaurant.settings?.acceptsReservations ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📅 Fecha
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🕐 Hora
                      </label>
                      <select
                        value={selectedTime}
                        onChange={e => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Selecciona una hora</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="13:30">1:30 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="19:30">7:30 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="20:30">8:30 PM</option>
                        <option value="21:00">9:00 PM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        👥 Número de Personas
                      </label>
                      <select
                        value={partySize}
                        onChange={e => setPartySize(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                          <option key={size} value={size}>
                            {size} {size === 1 ? 'persona' : 'personas'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {restaurant.settings?.depositRequired && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          💳 <strong>Depósito requerido:</strong> $
                          {restaurant.settings.depositAmount}
                        </p>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                      }}
                      onClick={handleReservation}
                      disabled={!selectedDate || !selectedTime}
                    >
                      Confirmar Reserva
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Recibirás confirmación por WhatsApp
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Este restaurante no acepta reservas online actualmente.
                    </p>
                    <p className="text-sm text-gray-500">
                      Por favor, contacta directamente al restaurante para reservar.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
