'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button, Card, CardContent, Badge } from '@yumyum/ui';
import { formatDate } from '@yumyum/utils';

interface Reservation {
  id: string;
  confirmationCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  specialRequests?: string;
  restaurant: {
    id: string;
    name: string;
  };
  table?: {
    id: string;
    tableNumber: string;
  };
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-800', icon: '✓' },
  seated: { label: 'Sentado', color: 'bg-purple-100 text-purple-800', icon: '🪑' },
  completed: { label: 'Completada', color: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: '❌' },
  no_show: { label: 'No Show', color: 'bg-gray-100 text-gray-800', icon: '👻' },
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Reservation['status']>('all');
  const [dateFilter, setDateFilter] = useState('today');

  useEffect(() => {
    fetchReservations();
  }, [filter, dateFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params: any = {};

      if (filter !== 'all') {
        params.status = filter;
      }

      if (dateFilter === 'today') {
        params.date = new Date().toISOString().split('T')[0];
      }

      const response = await api.get('/reservations', { params });

      if (response.data.success) {
        setReservations(response.data.data.reservations || response.data.data.items || []);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmReservation = async (id: string) => {
    try {
      await api.post(`/reservations/${id}/confirm`);
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al confirmar');
    }
  };

  const seatReservation = async (id: string) => {
    try {
      await api.post(`/reservations/${id}/seat`);
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al sentar');
    }
  };

  const completeReservation = async (id: string) => {
    try {
      await api.post(`/reservations/${id}/complete`);
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al completar');
    }
  };

  const cancelReservation = async (id: string) => {
    const reason = prompt('Motivo de cancelación:');
    if (!reason) return;

    try {
      await api.post(`/reservations/${id}/cancel`, { reason });
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cancelar');
    }
  };

  const markNoShow = async (id: string) => {
    if (!confirm('¿Marcar como No Show?')) return;

    try {
      await api.post(`/reservations/${id}/no-show`);
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error');
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600 mt-1">Gestiona las reservas de tu restaurante</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => setFilter('all')}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => setFilter('pending')}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => setFilter('confirmed')}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
            <p className="text-sm text-gray-600">Confirmadas</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => setFilter('seated')}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.seated}</p>
            <p className="text-sm text-gray-600">Sentados</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => setFilter('completed')}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Fecha</label>
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Todas</option>
                <option value="today">Hoy</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
              <div className="flex items-center space-x-2">
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

      {/* Reservations List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : reservations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reservas</h3>
            <p className="text-gray-600">
              No se encontraron reservas con los filtros seleccionados
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map(reservation => {
            const config = statusConfig[reservation.status];
            return (
              <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {reservation.customerName}
                        </h3>
                        <Badge className={config.color}>
                          {config.icon} {config.label}
                        </Badge>
                        {reservation.table && (
                          <Badge variant="outline">Mesa {reservation.table.tableNumber}</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">📅 Fecha:</span>{' '}
                          {formatDate(new Date(reservation.date))}
                        </div>
                        <div>
                          <span className="font-medium">⏰ Hora:</span> {reservation.time}
                        </div>
                        <div>
                          <span className="font-medium">👥 Personas:</span> {reservation.partySize}
                        </div>
                        <div>
                          <span className="font-medium">📱 Teléfono:</span>{' '}
                          {reservation.customerPhone}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">✉️ Email:</span> {reservation.customerEmail}
                      </div>

                      {reservation.specialRequests && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                          <span className="font-medium text-yellow-900">
                            Solicitudes especiales:
                          </span>
                          <p className="text-yellow-800 mt-1">{reservation.specialRequests}</p>
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-500">
                        Código de confirmación:{' '}
                        <span className="font-mono font-medium">
                          {reservation.confirmationCode}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {reservation.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => confirmReservation(reservation.id)}>
                            ✓ Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => cancelReservation(reservation.id)}
                          >
                            ❌ Cancelar
                          </Button>
                        </>
                      )}

                      {reservation.status === 'confirmed' && (
                        <>
                          <Button size="sm" onClick={() => seatReservation(reservation.id)}>
                            🪑 Sentar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markNoShow(reservation.id)}
                          >
                            👻 No Show
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => cancelReservation(reservation.id)}
                          >
                            ❌ Cancelar
                          </Button>
                        </>
                      )}

                      {reservation.status === 'seated' && (
                        <Button size="sm" onClick={() => completeReservation(reservation.id)}>
                          ✅ Completar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
