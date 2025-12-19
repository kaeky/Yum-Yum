'use client';

import { useState } from 'react';
import { Button, Card, CardContent } from '@yumyum/ui';
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
  isBefore,
  startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';

interface DatePickerCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePickerCalendar({
  selectedDate,
  onDateSelect,
  minDate = new Date(), // Default: today
  maxDate,
}: DatePickerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
  };

  // Check if date is selectable
  const isDateSelectable = (date: Date): boolean => {
    const dayStart = startOfDay(date);
    const minStart = startOfDay(minDate);

    // Can't select dates before minDate
    if (isBefore(dayStart, minStart)) {
      return false;
    }

    // Can't select dates after maxDate (if provided)
    if (maxDate && isBefore(startOfDay(maxDate), dayStart)) {
      return false;
    }

    return true;
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
          <h3 className="text-xl font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h3>
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
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const isSelectable = isDateSelectable(day);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => isSelectable && onDateSelect(day)}
                  disabled={!isSelectable}
                  className={`
                    min-h-[60px] p-2 rounded-lg border-2 transition-all
                    ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                    ${isTodayDate && !isSelected ? 'bg-yellow-50 border-yellow-300' : ''}
                    ${isSelectable ? 'hover:border-orange-300 cursor-pointer' : 'cursor-not-allowed opacity-30'}
                    ${!isSelectable && isCurrentMonth ? 'bg-gray-100' : ''}
                  `}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-center">
                    <span
                      className={`
                        text-lg font-semibold
                        ${isSelected ? 'text-orange-700' : ''}
                        ${isTodayDate && !isSelected ? 'text-yellow-700' : ''}
                        ${!isSelectable ? 'text-gray-400' : 'text-gray-900'}
                      `}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Today indicator */}
                  {isTodayDate && !isSelected && (
                    <div className="mt-1 text-xs text-yellow-600 font-medium">Hoy</div>
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
              <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-300 rounded"></div>
              <span className="text-gray-600">Hoy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-50 border-2 border-orange-500 rounded"></div>
              <span className="text-gray-600">Seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded opacity-30"></div>
              <span className="text-gray-600">No disponible</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
