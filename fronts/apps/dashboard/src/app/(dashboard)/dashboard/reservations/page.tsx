'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button, Card, CardContent, Badge } from '@yumyum/ui';
import { useSocket } from '@/hooks/useSocket';
import Link from 'next/link';
import { ReservationsCalendar } from '@/components/reservations-calendar';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface Reservation {
  id: string;
  confirmationCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  reservationDate: string;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  specialRequests?: string;
  table?: {
    id: string;
    number: number;
    section: string;
  };
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    indicatorColor: 'bg-yellow-400',
    cardClass: 'bg-white border-gray-200',
    hoverClass: 'hover:border-yellow-400 hover:bg-yellow-50/30',
  },
  confirmed: {
    label: 'Confirmada',
    color: 'bg-blue-100 text-blue-800',
    icon: '✓',
    indicatorColor: 'bg-blue-500',
    cardClass: 'bg-white border-gray-200',
    hoverClass: 'hover:border-blue-400 hover:bg-blue-50/30',
  },
  seated: {
    label: 'Sentado',
    color: 'bg-purple-100 text-purple-800',
    icon: '🪑',
    indicatorColor: 'bg-purple-500',
    cardClass: 'bg-white border-gray-200',
    hoverClass: 'hover:border-purple-400 hover:bg-purple-50/30',
  },
  completed: {
    label: 'Completada',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
    indicatorColor: 'bg-green-400',
    cardClass: 'bg-white border-gray-300',
    hoverClass: 'hover:border-green-400 hover:bg-green-50/30',
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    indicatorColor: 'bg-red-400',
    cardClass: 'bg-white border-gray-300',
    hoverClass: 'hover:border-red-400 hover:bg-red-50/30',
  },
  no_show: {
    label: 'No Show',
    color: 'bg-gray-100 text-gray-800',
    icon: '👻',
    indicatorColor: 'bg-gray-400',
    cardClass: 'bg-white border-gray-300',
    hoverClass: 'hover:border-gray-400 hover:bg-gray-50/30',
  },
};

// Helper function to format date as YYYY-MM-DD in local timezone
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ReservationsPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Reservation['status']>('all');
  const [selectedDate, setSelectedDate] = useState(() => formatDateLocal(new Date()));
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);

      if (!user?.restaurantId) {
        console.log('No restaurantId found for user');
        setLoading(false);
        return;
      }

      const params: any = {
        restaurantId: user.restaurantId,
        limit: 1000, // Increase limit for calendar view
      };

      // For both views, use date parameter
      // Calendar view will get more data but we'll filter client-side
      if (view === 'list') {
        // Send date with noon time to avoid timezone issues
        params.date = new Date(selectedDate + 'T12:00:00').toISOString();
      }

      if (filter !== 'all') {
        params.status = filter;
      }

      console.log('Fetching reservations with params:', params);
      const response = await api.get('/reservations', { params });

      if (response.data.success) {
        const allReservations = response.data.data.reservations || [];

        // For calendar view, filter to current month client-side
        if (view === 'calendar') {
          const date = new Date(selectedDate);
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);

          const filteredReservations = allReservations.filter((r: any) => {
            const resDate = new Date(r.reservationDate);
            return resDate >= monthStart && resDate <= monthEnd;
          });

          setReservations(filteredReservations);
        } else {
          setReservations(allReservations);
        }
      }
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  }, [user, selectedDate, view, filter]);

  useEffect(() => {
    if (user?.restaurantId) {
      fetchReservations();
    }
  }, [fetchReservations, user]);

  // WebSocket: Listen for reservation updates
  useEffect(() => {
    if (socket && isConnected && user?.restaurantId) {
      socket.emit('join:restaurant', user.restaurantId);

      const handleReservationEvent = (data: any) => {
        console.log('Reservation event received:', data);
        fetchReservations();
      };

      socket.on('reservation:created', handleReservationEvent);
      socket.on('reservation:updated', handleReservationEvent);
      socket.on('reservation:confirmed', handleReservationEvent);
      socket.on('reservation:seated', handleReservationEvent);
      socket.on('reservation:completed', handleReservationEvent);
      socket.on('reservation:cancelled', handleReservationEvent);
      socket.on('reservation:no-show', handleReservationEvent);

      return () => {
        socket.off('reservation:created', handleReservationEvent);
        socket.off('reservation:updated', handleReservationEvent);
        socket.off('reservation:confirmed', handleReservationEvent);
        socket.off('reservation:seated', handleReservationEvent);
        socket.off('reservation:completed', handleReservationEvent);
        socket.off('reservation:cancelled', handleReservationEvent);
        socket.off('reservation:no-show', handleReservationEvent);
        socket.emit('leave:restaurant', user.restaurantId);
      };
    }
  }, [socket, isConnected, user, fetchReservations]);

  const confirmReservation = async (id: string) => {
    try {
      await api.post(`/reservations/${id}/confirm`);
      // No need to refresh, WebSocket will handle it
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al confirmar');
    }
  };

  const seatReservation = async (id: string) => {
    try {
      await api.post(`/reservations/${id}/seat`);
      // No need to refresh, WebSocket will handle it
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al sentar');
    }
  };

  const completeReservation = async (id: string) => {
    try {
      await api.post(`/reservations/${id}/complete`);
      // No need to refresh, WebSocket will handle it
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al completar');
    }
  };

  const cancelReservation = async (id: string) => {
    const reason = prompt('Motivo de cancelación:');
    if (!reason) return;

    try {
      await api.post(`/reservations/${id}/cancel`, { reason });
      // No need to refresh, WebSocket will handle it
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cancelar');
    }
  };

  const markNoShow = async (id: string) => {
    if (!confirm('¿Marcar como No Show?')) return;

    try {
      await api.post(`/reservations/${id}/no-show`);
      // No need to refresh, WebSocket will handle it
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
      full: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
    };
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    seated: reservations.filter(r => r.status === 'seated').length,
    completed: reservations.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600 mt-1">Gestiona las reservas de tu restaurante</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={view === 'list' ? 'default' : 'ghost'}
              onClick={() => setView('list')}
            >
              📋 Lista
            </Button>
            <Button
              size="sm"
              variant={view === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setView('calendar')}
            >
              📅 Calendario
            </Button>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              En vivo
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setFilter('all')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setFilter('pending')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setFilter('confirmed')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
            <p className="text-sm text-gray-600">Confirmadas</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setFilter('seated')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.seated}</p>
            <p className="text-sm text-gray-600">Sentados</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setFilter('completed')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Only show in list view */}
      {view === 'list' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Date Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              {/* Quick Date Buttons */}
              <div className="flex gap-2 items-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setSelectedDate(formatDateLocal(yesterday));
                  }}
                >
                  Ayer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedDate(formatDateLocal(new Date()))}
                >
                  Hoy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setSelectedDate(formatDateLocal(tomorrow));
                  }}
                >
                  Mañana
                </Button>
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                  >
                    Todas
                  </Button>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={filter === status ? 'default' : 'outline'}
                      onClick={() => setFilter(status as any)}
                    >
                      {config.icon} {config.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar or List View */}
      {view === 'calendar' ? (
        <ReservationsCalendar
          reservations={reservations}
          selectedDate={new Date(selectedDate + 'T12:00:00')}
          onDateSelect={date => {
            setSelectedDate(formatDateLocal(date));
            setView('list'); // Switch to list view when clicking a date
          }}
          onMonthChange={date => {
            setSelectedDate(formatDateLocal(date));
          }}
        />
      ) : loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando reservas...</p>
        </div>
      ) : reservations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reservas</h3>
            <p className="text-gray-600">
              {filter !== 'all'
                ? 'No se encontraron reservas con este estado'
                : 'No hay reservas para esta fecha'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {reservations.map(reservation => {
            const config = statusConfig[reservation.status];
            const { time, full } = formatDateTime(reservation.reservationDate);

            return (
              <Link key={reservation.id} href={`/dashboard/reservations/${reservation.id}`}>
                <Card
                  className={`hover:shadow-md transition-all cursor-pointer border ${config.cardClass} ${config.hoverClass}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Status Indicator - Círculo de color */}
                      <div
                        className={`w-3 h-3 rounded-full ${config.indicatorColor} flex-shrink-0`}
                        title={config.label}
                      ></div>

                      {/* Time Badge - Compacto */}
                      <div className="flex flex-col items-center justify-center bg-sky-50 rounded-md px-2 py-1.5 min-w-[60px]">
                        <p className="text-lg font-bold text-sky-600 leading-none">{time}</p>
                      </div>

                      {/* Info - Layout horizontal compacto */}
                      <div className="flex-1 min-w-0">
                        {/* Primera línea: Nombre, estado, mesa */}
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-gray-900 truncate">
                            {reservation.customerName}
                          </h3>
                          <Badge className={`${config.color} text-xs px-2 py-0.5`}>
                            {config.icon} {config.label}
                          </Badge>
                          {reservation.table && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              Mesa {reservation.table.number}
                            </Badge>
                          )}
                        </div>

                        {/* Segunda línea: Info compacta */}
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>👥 {reservation.partySize}</span>
                          <span className="truncate">📱 {reservation.customerPhone}</span>
                          <span className="hidden md:inline">
                            🔖 {reservation.confirmationCode}
                          </span>
                        </div>

                        {/* Solicitudes especiales - solo si existen */}
                        {reservation.specialRequests && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1 text-xs mt-1.5">
                            <span className="font-medium text-yellow-900">📝</span>{' '}
                            <span className="text-yellow-800">{reservation.specialRequests}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions - Botones compactos */}
                      <div className="flex items-center gap-1.5" onClick={e => e.preventDefault()}>
                        {reservation.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => confirmReservation(reservation.id)}
                              className="h-8 px-3 text-xs"
                            >
                              ✓
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => cancelReservation(reservation.id)}
                            >
                              ❌
                            </Button>
                          </>
                        )}

                        {reservation.status === 'confirmed' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => seatReservation(reservation.id)}
                              className="h-8 px-3 text-xs"
                            >
                              🪑
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markNoShow(reservation.id)}
                              className="h-8 px-3 text-xs"
                            >
                              👻
                            </Button>
                          </>
                        )}

                        {reservation.status === 'seated' && (
                          <Button
                            size="sm"
                            onClick={() => completeReservation(reservation.id)}
                            className="h-8 px-3 text-xs"
                          >
                            ✅
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
