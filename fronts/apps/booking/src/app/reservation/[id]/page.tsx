'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, CardContent, Badge } from '@yumyum/ui';
import api from '@/lib/api';
import Link from 'next/link';

interface Reservation {
  id: string;
  reservationDate: string;
  partySize: number;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  confirmationCode: string;
  restaurant: {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
  };
}

export default function ReservationPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params?.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reservations/${reservationId}`);

      if (response.data.success) {
        setReservation(response.data.data.reservation);
      }
    } catch (err: any) {
      console.error('Error fetching reservation:', err);
      setError('No se pudo cargar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!cancelReason.trim()) {
      alert('Por favor indica el motivo de la cancelación');
      return;
    }

    try {
      setCancelling(true);
      await api.post(`/reservations/${reservationId}/cancel`, {
        reason: cancelReason,
      });

      // Refresh reservation data
      await fetchReservation();
      setShowCancelDialog(false);
      setCancelReason('');
    } catch (err: any) {
      console.error('Error cancelling reservation:', err);
      alert(err.response?.data?.message || 'Error al cancelar la reserva');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-800' },
      seated: { label: 'En Mesa', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completada', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
      no_show: { label: 'No Asistió', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reserva...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reserva no encontrada</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const reservationDateTime = new Date(reservation.reservationDate);
  const canCancel = ['pending', 'confirmed'].includes(reservation.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {reservation.status === 'cancelled' ? 'Reserva Cancelada' : '¡Reserva Confirmada!'}
          </h1>
          <p className="text-gray-600">
            Código de confirmación:{' '}
            <span className="font-mono font-bold">{reservation.confirmationCode}</span>
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-6 text-center">{getStatusBadge(reservation.status)}</div>

        {/* Reservation Details */}
        <Card className="mb-6">
          <CardContent className="p-6 space-y-6">
            {/* Restaurant Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles del Restaurante</h2>
              <div className="space-y-2 text-gray-700">
                <p className="text-lg font-semibold">{reservation.restaurant.name}</p>
                <p className="flex items-start gap-2">
                  <span>📍</span>
                  <span>
                    {reservation.restaurant.address}, {reservation.restaurant.city}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📞</span>
                  <a href={`tel:${reservation.restaurant.phone}`} className="hover:underline">
                    {reservation.restaurant.phone}
                  </a>
                </p>
              </div>
            </div>

            {/* Reservation Info */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles de la Reserva</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha</p>
                  <p className="font-semibold text-gray-900">
                    {reservationDateTime.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hora</p>
                  <p className="font-semibold text-gray-900">
                    {reservationDateTime.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Personas</p>
                  <p className="font-semibold text-gray-900">
                    {reservation.partySize} {reservation.partySize === 1 ? 'persona' : 'personas'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nombre</p>
                  <p className="font-semibold text-gray-900">{reservation.customerName}</p>
                </div>
              </div>

              {reservation.specialRequests && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Peticiones Especiales</p>
                  <p className="text-gray-700">{reservation.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Contacto</h2>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>{reservation.customerEmail}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📱</span>
                  <span>{reservation.customerPhone}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {canCancel && !showCancelDialog && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">¿Necesitas cancelar?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Si tus planes han cambiado, puedes cancelar tu reserva aquí
              </p>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancelar Reserva
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cancel Dialog */}
        {showCancelDialog && (
          <Card className="mb-6 border-red-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Cancelar Reserva</h3>
              <p className="text-sm text-gray-600 mb-4">
                Por favor indica el motivo de la cancelación
              </p>
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
                rows={3}
                placeholder="Ej: Cambio de planes, emergencia..."
                disabled={cancelling}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelDialog(false);
                    setCancelReason('');
                  }}
                  disabled={cancelling}
                  className="flex-1"
                >
                  Mantener Reserva
                </Button>
                <Button
                  onClick={handleCancelReservation}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {cancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline">← Volver al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
