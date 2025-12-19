'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Badge } from '@yumyum/ui';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';

interface Reservation {
  id: string;
  reservationDate: string;
  status: string;
  partySize: number;
  customerName: string;
}

interface ReservationsCalendarProps {
  reservations: Reservation[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
}

export function ReservationsCalendar({
  reservations,
  selectedDate,
  onDateSelect,
  onMonthChange,
}: ReservationsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const handlePreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    if (onMonthChange) onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    if (onMonthChange) onMonthChange(newMonth);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
    if (onMonthChange) onMonthChange(today);
  };

  // Get reservations for a specific date
  const getReservationsForDate = (date: Date) => {
    return reservations.filter(res => {
      const resDate = new Date(res.reservationDate);
      return isSameDay(resDate, date);
    });
  };

  // Get stats for a date
  const getDateStats = (date: Date) => {
    const dayReservations = getReservationsForDate(date);
    const total = dayReservations.length;
    const pending = dayReservations.filter(r => r.status === 'pending').length;
    const confirmed = dayReservations.filter(r => r.status === 'confirmed').length;
    const seated = dayReservations.filter(r => r.status === 'seated').length;

    return { total, pending, confirmed, seated };
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { locale: es });
    const calendarEnd = endOfWeek(monthEnd, { locale: es });

    const days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Hoy
            </Button>
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              ←
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              →
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const stats = getDateStats(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const dayReservations = getReservationsForDate(day);

              return (
                <button
                  key={index}
                  onClick={() => onDateSelect(day)}
                  className={`
                    min-h-[100px] p-2 rounded-lg border-2 transition-all
                    ${isSelected ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300'}
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                    ${isTodayDate ? 'bg-yellow-50' : 'bg-white'}
                  `}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                        text-sm font-semibold
                        ${isTodayDate ? 'text-yellow-700' : 'text-gray-900'}
                      `}
                    >
                      {format(day, 'd')}
                    </span>
                    {stats.total > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-1 py-0 h-5 bg-sky-100 text-sky-700 border-sky-300"
                      >
                        {stats.total}
                      </Badge>
                    )}
                  </div>

                  {/* Reservation Indicators */}
                  {stats.total > 0 && (
                    <div className="space-y-1">
                      {stats.pending > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-yellow-600">⏳</span>
                          <span className="text-yellow-700">{stats.pending}</span>
                        </div>
                      )}
                      {stats.confirmed > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-blue-600">✓</span>
                          <span className="text-blue-700">{stats.confirmed}</span>
                        </div>
                      )}
                      {stats.seated > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-600">🪑</span>
                          <span className="text-purple-700">{stats.seated}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Empty State */}
                  {stats.total === 0 && isCurrentMonth && (
                    <div className="text-xs text-gray-400 mt-2">Sin reservas</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">Leyenda:</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span>⏳</span>
              <span className="text-gray-600">Pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span className="text-gray-600">Confirmada</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🪑</span>
              <span className="text-gray-600">Sentado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
              <span className="text-gray-600">Hoy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-50 border-2 border-sky-500 rounded"></div>
              <span className="text-gray-600">Seleccionado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
