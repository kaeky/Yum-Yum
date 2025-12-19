'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button, Card, CardContent, Badge } from '@yumyum/ui';
import { useSocket } from '@/hooks/useSocket';
import Link from 'next/link';

interface Reservation {
  id: string;
  confirmationCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  reservationDate: string;
  estimatedDuration: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  specialRequests?: string;
  notes?: string;
  cancellationReason?: string;
  table?: {
    id: string;
    number: number;
    section: string;
    capacity: number;
  };
  customer?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-800', icon: '✓' },
  seated: { label: 'Sentado', color: 'bg-purple-100 text-purple-800', icon: '🪑' },
  completed: { label: 'Completada', color: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: '❌' },
  no_show: { label: 'No Show', color: 'bg-gray-100 text-gray-800', icon: '👻' },
};

export default function ReservationDetailPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const params = useParams();
  const reservationId = params?.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (reservationId && user?.restaurantId) {
      fetchReservation();
    }
  }, [reservationId, user]);

  // WebSocket: Listen for updates to THIS reservation
  useEffect(() => {
    if (socket && isConnected && user?.restaurantId) {
      socket.emit('join:restaurant', user.restaurantId);

      const handleReservationEvent = (data: any) => {
        console.log('Reservation event received:', data);
        // Refresh if it's our reservation
        if (data.reservation?.id === reservationId) {
          fetchReservation();
        }
      };

      socket.on('reservation:updated', handleReservationEvent);
      socket.on('reservation:confirmed', handleReservationEvent);
      socket.on('reservation:seated', handleReservationEvent);
      socket.on('reservation:completed', handleReservationEvent);
      socket.on('reservation:cancelled', handleReservationEvent);
      socket.on('reservation:no-show', handleReservationEvent);

      return () => {
        socket.off('reservation:updated', handleReservationEvent);
        socket.off('reservation:confirmed', handleReservationEvent);
        socket.off('reservation:seated', handleReservationEvent);
        socket.off('reservation:completed', handleReservationEvent);
        socket.off('reservation:cancelled', handleReservationEvent);
        socket.off('reservation:no-show', handleReservationEvent);
        socket.emit('leave:restaurant', user.restaurantId);
      };
    }
  }, [socket, isConnected, user, reservationId]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reservations/${reservationId}`);

      if (response.data.success) {
        const res = response.data.data.reservation;
        // Verify restaurant ownership
        if (res.restaurantId !== user?.restaurantId) {
          setError('No tienes permiso para ver esta reserva');
          return;
        }
        setReservation(res);
      }
    } catch (err: any) {
      console.error('Error fetching reservation:', err);
      setError('No se pudo cargar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const confirmReservation = async () => {
    try {
      setActionLoading(true);
      await api.post(`/reservations/${reservationId}/confirm`);
      // No need to refresh, WebSocket will handle it
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al confirmar');
    } finally {
      setActionLoading(false);
    }
  };

  const seatReservation = async () => {
    try {
      setActionLoading(true);
      await api.post(`/reservations/${reservationId}/seat`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al sentar');
    } finally {
      setActionLoading(false);
    }
  };

  const completeReservation = async () => {
    try {
      setActionLoading(true);
      await api.post(`/reservations/${reservationId}/complete`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al completar');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelReservation = async () => {
    const reason = prompt('Motivo de cancelación:');
    if (!reason) return;

    try {
      setActionLoading(true);
      await api.post(`/reservations/${reservationId}/cancel`, { reason });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cancelar');
    } finally {
      setActionLoading(false);
    }
  };

  const markNoShow = async () => {
    if (!confirm('¿Marcar como No Show?')) return;

    try {
      setActionLoading(true);
      await api.post(`/reservations/${reservationId}/no-show`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString('es-ES'),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando reserva...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/reservations">
          <Button variant="outline">← Volver a Reservas</Button>
        </Link>
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reserva no encontrada</h3>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config = statusConfig[reservation.status];
  const { date, time } = formatDateTime(reservation.reservationDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reservations">
            <Button variant="outline">← Volver</Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reserva #{reservation.confirmationCode}
            </h1>
            <p className="text-gray-600 mt-1">{reservation.customerName}</p>
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Actualizaciones en vivo
          </div>
        )}
      </div>

      {/* Status and Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{config.icon}</span>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <Badge className={config.color + ' text-lg px-4 py-2'}>{config.label}</Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {reservation.status === 'pending' && (
                <>
                  <Button onClick={confirmReservation} disabled={actionLoading}>
                    ✓ Confirmar
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={cancelReservation}
                    disabled={actionLoading}
                  >
                    ❌ Cancelar
                  </Button>
                </>
              )}

              {reservation.status === 'confirmed' && (
                <>
                  <Button onClick={seatReservation} disabled={actionLoading}>
                    🪑 Sentar
                  </Button>
                  <Button variant="outline" onClick={markNoShow} disabled={actionLoading}>
                    👻 No Show
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={cancelReservation}
                    disabled={actionLoading}
                  >
                    ❌ Cancelar
                  </Button>
                </>
              )}

              {reservation.status === 'seated' && (
                <Button onClick={completeReservation} disabled={actionLoading}>
                  ✅ Completar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reservation Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles de la Reserva</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha</p>
                    <p className="font-semibold text-gray-900">{date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hora</p>
                    <p className="font-semibold text-gray-900">{time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Número de Personas</p>
                    <p className="font-semibold text-gray-900">
                      {reservation.partySize} {reservation.partySize === 1 ? 'persona' : 'personas'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duración Estimada</p>
                    <p className="font-semibold text-gray-900">
                      {reservation.estimatedDuration} min
                    </p>
                  </div>
                </div>

                {reservation.table && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Mesa Asignada</p>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        Mesa {reservation.table.number}
                      </Badge>
                      <span className="text-gray-600">
                        Sección: {reservation.table.section} • Capacidad:{' '}
                        {reservation.table.capacity}
                      </span>
                    </div>
                  </div>
                )}

                {reservation.specialRequests && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Solicitudes Especiales</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-900">{reservation.specialRequests}</p>
                    </div>
                  </div>
                )}

                {reservation.notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Notas Internas</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-900">{reservation.notes}</p>
                    </div>
                  </div>
                )}

                {reservation.cancellationReason && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Motivo de Cancelación</p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-900">{reservation.cancellationReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Historial</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">📝</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Reserva creada</p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(reservation.createdAt).full}
                    </p>
                  </div>
                </div>

                {reservation.updatedAt !== reservation.createdAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🔄</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Última actualización</p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(reservation.updatedAt).full}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          {/* Customer Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Cliente</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nombre</p>
                  <p className="font-semibold text-gray-900">{reservation.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <a
                    href={`mailto:${reservation.customerEmail}`}
                    className="text-sky-600 hover:underline"
                  >
                    {reservation.customerEmail}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <a
                    href={`tel:${reservation.customerPhone}`}
                    className="text-sky-600 hover:underline"
                  >
                    {reservation.customerPhone}
                  </a>
                </div>

                {reservation.customer && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-2">Cliente Registrado</p>
                    <Link href={`/dashboard/customers/${reservation.customer.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Perfil del Cliente →
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información Rápida</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Código de Confirmación</span>
                  <span className="font-mono font-semibold">{reservation.confirmationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Reserva</span>
                  <span className="font-mono text-xs">{reservation.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
