'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@yumyum/ui';
import Link from 'next/link';

interface Reservation {
  id: string;
  customerName: string;
  partySize: number;
  time: string;
  status: string;
  table?: { tableNumber: string };
}

interface Table {
  id: string;
  status: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user's restaurants
      const restResponse = await api.get('/restaurants/my-restaurants');
      const userRestaurants = restResponse.data.data.restaurants || [];
      setRestaurants(userRestaurants);

      if (userRestaurants.length > 0) {
        const restaurantId = userRestaurants[0].id;

        // Fetch today's reservations
        const today = new Date().toISOString().split('T')[0];
        const resResponse = await api.get('/reservations', {
          params: { restaurantId, date: today },
        });
        setReservations(resResponse.data.data.reservations || resResponse.data.data.items || []);

        // Fetch tables
        const tablesResponse = await api.get(`/restaurants/${restaurantId}/tables`);
        setTables(tablesResponse.data.data.tables || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const todayReservations = reservations.length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;

  const stats = [
    {
      title: 'Reservas Hoy',
      value: todayReservations.toString(),
      change: `${pendingReservations} pendientes`,
      icon: '📅',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Mesas Ocupadas',
      value: `${occupiedTables}/${tables.length}`,
      change: tables.length > 0 ? `${Math.round((occupiedTables / tables.length) * 100)}%` : '0%',
      icon: '🪑',
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Confirmadas',
      value: confirmedReservations.toString(),
      change: 'Listas',
      icon: '✓',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Restaurantes',
      value: restaurants.length.toString(),
      change: 'Activos',
      icon: '🏪',
      color: 'bg-orange-50 text-orange-700',
    },
  ];

  const upcomingReservations = reservations
    .filter(r => r.status === 'confirmed' || r.status === 'pending')
    .slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido {user?.firstName}, aquí está tu resumen de hoy
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-sm px-3 py-1">
            🟢 Abierto
          </Badge>
          <time className="text-sm text-gray-600">
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <Card key={stat.title} className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl`}
                >
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Reservations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Próximas Reservas</CardTitle>
            <Badge variant="outline" className="text-xs">
              {upcomingReservations.length} reservas
            </Badge>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-2">📅</p>
                <p>No hay reservas para hoy</p>
                <Link
                  href="/dashboard/reservations"
                  className="text-sky-600 text-sm hover:underline"
                >
                  Ver todas las reservas →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingReservations.map(reservation => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                        <span className="text-sky-700 font-semibold text-sm">
                          {reservation.time}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{reservation.customerName}</p>
                        <p className="text-sm text-gray-600">
                          {reservation.partySize} personas
                          {reservation.table && ` · Mesa ${reservation.table.tableNumber}`}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {reservation.status === 'confirmed' ? '✓ Confirmada' : '⏳ Pendiente'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Reservas Confirmadas</p>
                  <p className="text-2xl font-bold text-blue-600">{confirmedReservations}</p>
                </div>
                <div className="text-3xl">✓</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Reservas Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingReservations}</p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Mesas Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">
                    {tables.length - occupiedTables}
                  </p>
                </div>
                <div className="text-3xl">🪑</div>
              </div>

              {restaurants.length === 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">¿Aún no tienes un restaurante?</p>
                  <Link href="/dashboard/restaurants/new">
                    <Button className="w-full" size="sm">
                      Crear Mi Restaurante
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📅', label: 'Nueva Reserva', color: 'from-blue-500 to-blue-600' },
              { icon: '🛎️', label: 'Nueva Orden', color: 'from-orange-500 to-orange-600' },
              { icon: '👥', label: 'Registrar Cliente', color: 'from-green-500 to-green-600' },
              { icon: '📊', label: 'Ver Reportes', color: 'from-purple-500 to-purple-600' },
            ].map((action, index) => (
              <button
                key={index}
                className={`p-6 rounded-xl bg-gradient-to-br ${action.color} text-white hover:shadow-lg transition-all hover:-translate-y-1`}
              >
                <div className="text-4xl mb-2">{action.icon}</div>
                <p className="text-sm font-medium">{action.label}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
