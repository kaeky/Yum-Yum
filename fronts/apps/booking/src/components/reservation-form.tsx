'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Label, Card, CardContent } from '@yumyum/ui';
import api from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { DatePickerCalendar } from './date-picker-calendar';
import { addDays } from 'date-fns';

interface TimeSlot {
  time: string;
  available: boolean;
  tablesAvailable: number;
  reason?: string;
}

interface ReservationFormProps {
  restaurantId: string;
  restaurantName: string;
  maxPartySize: number;
  onSuccess?: (reservation: any) => void;
}

export function ReservationForm({
  restaurantId,
  restaurantName,
  maxPartySize,
  onSuccess,
}: ReservationFormProps) {
  const [step, setStep] = useState<'datetime' | 'details' | 'submitting'>('datetime');

  // Step 1: Date, Time, Party Size
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [partySize, setPartySize] = useState(2);

  // Availability
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  // Step 2: Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // WebSocket connection
  const { socket, isConnected } = useSocket();

  // Fetch available slots when date or party size changes
  useEffect(() => {
    if (selectedDate && partySize) {
      fetchAvailableSlots();
    }
  }, [selectedDate, partySize]);

  // WebSocket: Join restaurant room and listen for reservation updates
  useEffect(() => {
    if (socket && isConnected && restaurantId) {
      // Join the restaurant room
      socket.emit('join:restaurant', restaurantId);

      // Listen for new reservations that might affect availability
      const handleReservationCreated = () => {
        // Refresh availability when a new reservation is created
        if (selectedDate && partySize) {
          console.log('New reservation detected, refreshing availability...');
          fetchAvailableSlots();
        }
      };

      socket.on('reservation:created', handleReservationCreated);

      // Cleanup
      return () => {
        socket.off('reservation:created', handleReservationCreated);
        socket.emit('leave:restaurant', restaurantId);
      };
    }
  }, [socket, isConnected, restaurantId, selectedDate, partySize]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;

    try {
      setLoadingSlots(true);
      setSlotsError('');
      setAvailableSlots([]);
      setSelectedTime('');

      // Set time to noon to avoid timezone issues
      const dateAtNoon = new Date(selectedDate);
      dateAtNoon.setHours(12, 0, 0, 0);
      const dateTime = dateAtNoon.toISOString();

      const response = await api.get(`/reservations/restaurants/${restaurantId}/availability`, {
        params: {
          date: dateTime,
          partySize,
        },
      });

      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots || []);
      }
    } catch (err: any) {
      console.error('Error fetching slots:', err);
      setSlotsError(err.response?.data?.message || 'Error al cargar horarios disponibles');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleContinueToDetails = () => {
    if (!selectedDate || !selectedTime || !partySize) {
      setError('Por favor selecciona fecha, hora y número de personas');
      return;
    }
    setError('');
    setStep('details');
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Format date as YYYY-MM-DD in local timezone
      if (!selectedDate) {
        setError('Por favor selecciona una fecha');
        setSubmitting(false);
        return;
      }

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const reservationDateTime = new Date(`${dateStr}T${selectedTime}:00`).toISOString();

      const response = await api.post(`/reservations/restaurants/${restaurantId}`, {
        reservationDate: reservationDateTime,
        partySize,
        customerName,
        customerEmail,
        customerPhone,
        specialRequests: specialRequests || undefined,
        estimatedDuration: 90,
      });

      if (response.data.success && onSuccess) {
        onSuccess(response.data.data.reservation);
      }
    } catch (err: any) {
      console.error('Error creating reservation:', err);
      setError(err.response?.data?.message || 'Error al crear la reserva');
      setSubmitting(false);
    }
  };

  if (step === 'datetime') {
    return (
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservar en {restaurantName}</h3>
            <div className="flex items-center gap-2">
              <p className="text-gray-600">Selecciona fecha, hora y número de personas</p>
              {isConnected && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  En vivo
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Party Size */}
          <div>
            <Label htmlFor="partySize">Número de Personas</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPartySize(Math.max(1, partySize - 1))}
                disabled={partySize <= 1}
              >
                -
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{partySize}</span>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPartySize(Math.min(maxPartySize, partySize + 1))}
                disabled={partySize >= maxPartySize}
              >
                +
              </Button>
              <span className="text-sm text-gray-600 ml-2">(máx. {maxPartySize})</span>
            </div>
          </div>

          {/* Date Calendar */}
          <div>
            <Label>Fecha</Label>
            <div className="mt-2">
              <DatePickerCalendar
                selectedDate={selectedDate}
                onDateSelect={date => setSelectedDate(date)}
                minDate={new Date()}
                maxDate={addDays(new Date(), 90)}
              />
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <Label>Hora Disponible</Label>
              {loadingSlots ? (
                <div className="mt-2 p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Cargando horarios...</p>
                </div>
              ) : slotsError ? (
                <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {slotsError}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  No hay horarios disponibles para esta fecha
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          selectedTime === slot.time
                            ? 'bg-orange-500 text-white'
                            : slot.available
                              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                      title={slot.reason || `${slot.tablesAvailable} mesas disponibles`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Continue Button */}
          <div className="pt-4 border-t">
            <Button
              onClick={handleContinueToDetails}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={!selectedDate || !selectedTime || !partySize}
            >
              Continuar →
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'details') {
    return (
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmitReservation} className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Datos de Contacto</h3>
              <p className="text-gray-600">Completa tus datos para confirmar la reserva</p>
            </div>

            {/* Summary */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Resumen de tu reserva:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  📅{' '}
                  {selectedDate?.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </li>
                <li>🕐 {selectedTime}</li>
                <li>
                  👥 {partySize} {partySize === 1 ? 'persona' : 'personas'}
                </li>
              </ul>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep('datetime')}
                className="mt-3"
              >
                ← Cambiar
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Customer Name */}
            <div>
              <Label htmlFor="customerName">
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                required
                placeholder="Juan Pérez"
                disabled={submitting}
              />
            </div>

            {/* Customer Email */}
            <div>
              <Label htmlFor="customerEmail">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                required
                placeholder="juan@example.com"
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">Recibirás la confirmación en este email</p>
            </div>

            {/* Customer Phone */}
            <div>
              <Label htmlFor="customerPhone">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                required
                placeholder="+34 600 000 000"
                disabled={submitting}
              />
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests">Peticiones Especiales (Opcional)</Label>
              <textarea
                id="specialRequests"
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Ej: Mesa cerca de la ventana, silla de bebé, alergia..."
                disabled={submitting}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('datetime')}
                disabled={submitting}
                className="flex-1"
              >
                ← Volver
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {submitting ? 'Reservando...' : 'Confirmar Reserva'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return null;
}
