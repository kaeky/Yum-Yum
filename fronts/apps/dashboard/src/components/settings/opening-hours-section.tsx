'use client';

import { useState, useEffect } from 'react';
import { Button } from '@yumyum/ui';
import { api } from '@/lib/api';

interface TimeSlot {
  id: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  notes?: string;
}

interface OpeningHoursSectionProps {
  restaurantId: string;
}

const DAYS_MAP = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function OpeningHoursSection({ restaurantId }: OpeningHoursSectionProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTimeSlots();
  }, [restaurantId]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/${restaurantId}/time-slots`);
      if (response.data.success) {
        setTimeSlots(response.data.data.timeSlots);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefaults = async () => {
    if (!confirm('¿Crear horarios por defecto (9:00 - 22:00) para todos los días?')) return;

    try {
      setSaving(true);
      await api.post(`/restaurants/${restaurantId}/time-slots/defaults`);
      await fetchTimeSlots();
      setSuccess('Horarios por defecto creados');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating defaults:', error);
      setError('Error al crear horarios por defecto');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slotId: string) => {
    try {
      await api.post(`/restaurants/${restaurantId}/time-slots/${slotId}/toggle-active`);
      await fetchTimeSlots();
    } catch (error) {
      console.error('Error toggling time slot:', error);
      setError('Error al cambiar el estado del horario');
    }
  };

  const handleDelete = async (slotId: string) => {
    if (!confirm('¿Eliminar este horario?')) return;

    try {
      await api.delete(`/restaurants/${restaurantId}/time-slots/${slotId}`);
      await fetchTimeSlots();
      setSuccess('Horario eliminado');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting time slot:', error);
      setError('Error al eliminar el horario');
    }
  };

  // Group time slots by day
  const slotsByDay: Record<string, TimeSlot[]> = {};
  DAYS_ORDER.forEach(day => {
    slotsByDay[day] = timeSlots.filter(slot => slot.dayOfWeek === day);
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Horarios de Apertura</h2>
          <p className="text-sm text-gray-600">
            Define los horarios en que tu restaurante está abierto
          </p>
        </div>
        {timeSlots.length === 0 && (
          <Button onClick={handleCreateDefaults} disabled={saving}>
            Crear Horarios por Defecto
          </Button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Empty State */}
      {timeSlots.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🕐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay horarios configurados</h3>
          <p className="text-gray-600 mb-4">Crea horarios por defecto o añade manualmente</p>
        </div>
      ) : (
        /* Time Slots by Day */
        <div className="space-y-3">
          {DAYS_ORDER.map(day => {
            const daySlots = slotsByDay[day];
            const hasSlots = daySlots.length > 0;

            return (
              <div
                key={day}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Day Name */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {DAYS_MAP[day as keyof typeof DAYS_MAP]}
                    </h3>
                    {!hasSlots && <p className="text-sm text-gray-500">Cerrado</p>}
                  </div>

                  {/* Time Slots */}
                  <div className="flex-1 flex flex-wrap gap-2">
                    {daySlots.map(slot => (
                      <div
                        key={slot.id}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                          ${
                            slot.isActive
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-100 border border-gray-200'
                          }
                        `}
                      >
                        <span className={slot.isActive ? 'text-green-700' : 'text-gray-500'}>
                          {slot.openTime} - {slot.closeTime}
                        </span>
                        <button
                          onClick={() => handleToggleActive(slot.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={slot.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {slot.isActive ? '✓' : '○'}
                        </button>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="text-red-400 hover:text-red-600"
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Button */}
                  <div className="ml-4">
                    <button
                      onClick={() => setEditingDay(day)}
                      className="px-3 py-1.5 text-sm text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                    >
                      + Añadir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Time Slot Modal */}
      {editingDay && (
        <AddTimeSlotModal
          restaurantId={restaurantId}
          dayOfWeek={editingDay}
          onClose={() => setEditingDay(null)}
          onSuccess={() => {
            fetchTimeSlots();
            setEditingDay(null);
          }}
        />
      )}
    </div>
  );
}

interface AddTimeSlotModalProps {
  restaurantId: string;
  dayOfWeek: string;
  onClose: () => void;
  onSuccess: () => void;
}

function AddTimeSlotModal({ restaurantId, dayOfWeek, onClose, onSuccess }: AddTimeSlotModalProps) {
  const [formData, setFormData] = useState({
    openTime: '09:00',
    closeTime: '22:00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post(`/restaurants/${restaurantId}/time-slots`, {
        dayOfWeek,
        ...formData,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear horario');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Añadir Horario</h2>
              <p className="text-sm text-gray-600 mt-1">
                {DAYS_MAP[dayOfWeek as keyof typeof DAYS_MAP]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Open Time */}
            <div>
              <label htmlFor="openTime" className="block text-sm font-medium text-gray-700 mb-1">
                Apertura
              </label>
              <input
                type="time"
                id="openTime"
                value={formData.openTime}
                onChange={e => setFormData({ ...formData, openTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Close Time */}
            <div>
              <label htmlFor="closeTime" className="block text-sm font-medium text-gray-700 mb-1">
                Cierre
              </label>
              <input
                type="time"
                id="closeTime"
                value={formData.closeTime}
                onChange={e => setFormData({ ...formData, closeTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Guardando...' : 'Crear Horario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
