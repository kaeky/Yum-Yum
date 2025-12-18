'use client';

import { useState, useEffect } from 'react';
import { Button } from '@yumyum/ui';
import { api } from '@/lib/api';

interface PaymentSettings {
  requiresDeposit?: boolean;
  depositAmount?: number;
  depositThreshold?: number; // Party size threshold
  enablePreOrder?: boolean;
  enableTableOrdering?: boolean;
}

interface PaymentSettingsSectionProps {
  restaurantId: string;
}

export function PaymentSettingsSection({ restaurantId }: PaymentSettingsSectionProps) {
  const [settings, setSettings] = useState<PaymentSettings>({
    requiresDeposit: false,
    depositAmount: 10,
    depositThreshold: 6,
    enablePreOrder: false,
    enableTableOrdering: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, [restaurantId]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/${restaurantId}`);
      if (response.data.success) {
        const restaurantSettings = response.data.data.restaurant.settings || {};
        setSettings({
          requiresDeposit: restaurantSettings.requiresDeposit || false,
          depositAmount: restaurantSettings.depositAmount || 10,
          depositThreshold: restaurantSettings.depositThreshold || 6,
          enablePreOrder: restaurantSettings.enablePreOrder || false,
          enableTableOrdering: restaurantSettings.enableTableOrdering || false,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await api.patch(`/restaurants/${restaurantId}`, {
        settings,
      });
      setSuccess('Configuración actualizada exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Configuración de Pagos y Funcionalidades
        </h2>
        <p className="text-sm text-gray-600">Configura anticipo, pre-orden y órdenes desde mesa</p>
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

      {/* Deposit Section */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Anticipo de Reserva</h3>
          <p className="text-sm text-gray-600 mb-4">Requiere un anticipo para grupos grandes</p>
        </div>

        {/* Requires Deposit Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.requiresDeposit}
            onChange={e => setSettings({ ...settings, requiresDeposit: e.target.checked })}
            className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
            disabled={saving}
          />
          <div>
            <span className="text-sm font-medium text-gray-700">
              Requiere anticipo para grupos grandes
            </span>
            <p className="text-xs text-gray-500">Se solicitará un pago por adelantado</p>
          </div>
        </label>

        {settings.requiresDeposit && (
          <div className="ml-7 space-y-4 pt-2">
            {/* Deposit Amount */}
            <div>
              <label
                htmlFor="depositAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Monto de Anticipo (por persona)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  id="depositAmount"
                  value={settings.depositAmount}
                  onChange={e =>
                    setSettings({ ...settings, depositAmount: parseFloat(e.target.value) })
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                  disabled={saving}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Monto que se cobrará por persona como anticipo
              </p>
            </div>

            {/* Deposit Threshold */}
            <div>
              <label
                htmlFor="depositThreshold"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Aplicar a partir de (personas)
              </label>
              <input
                type="number"
                id="depositThreshold"
                value={settings.depositThreshold}
                onChange={e =>
                  setSettings({ ...settings, depositThreshold: parseInt(e.target.value) })
                }
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                min="1"
                required
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Solo se requerirá anticipo para reservas de {settings.depositThreshold || 1}+
                personas
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pre-Order Section */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Pre-Orden</h3>
          <p className="text-sm text-gray-600 mb-4">
            Permite a los clientes ordenar antes de llegar
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enablePreOrder}
            onChange={e => setSettings({ ...settings, enablePreOrder: e.target.checked })}
            className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
            disabled={saving}
          />
          <div>
            <span className="text-sm font-medium text-gray-700">
              Habilitar pre-orden desde reserva
            </span>
            <p className="text-xs text-gray-500">Los clientes podrán ordenar al hacer la reserva</p>
          </div>
        </label>

        {settings.enablePreOrder && (
          <div className="ml-7 pt-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              ℹ️ Los clientes verán el menú durante el proceso de reserva y podrán seleccionar sus
              platillos por adelantado.
            </div>
          </div>
        )}
      </div>

      {/* Table Ordering Section */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Órdenes desde Mesa</h3>
          <p className="text-sm text-gray-600 mb-4">
            Permite ordenar escaneando el código QR de la mesa
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enableTableOrdering}
            onChange={e => setSettings({ ...settings, enableTableOrdering: e.target.checked })}
            className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
            disabled={saving}
          />
          <div>
            <span className="text-sm font-medium text-gray-700">
              Habilitar órdenes desde QR de mesa
            </span>
            <p className="text-xs text-gray-500">
              Los clientes escanean el QR y ordenan desde su celular
            </p>
          </div>
        </label>

        {settings.enableTableOrdering && (
          <div className="ml-7 pt-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              ℹ️ Genera códigos QR para tus mesas en la sección de Mesas. Los clientes podrán
              ordenar directamente desde su teléfono.
            </div>
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Resumen de Configuración</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className={settings.requiresDeposit ? 'text-green-600' : 'text-gray-400'}>
              {settings.requiresDeposit ? '✓' : '○'}
            </span>
            <span>
              Anticipo:{' '}
              {settings.requiresDeposit
                ? `$${settings.depositAmount} para ${settings.depositThreshold}+ personas`
                : 'Deshabilitado'}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className={settings.enablePreOrder ? 'text-green-600' : 'text-gray-400'}>
              {settings.enablePreOrder ? '✓' : '○'}
            </span>
            <span>Pre-orden: {settings.enablePreOrder ? 'Habilitado' : 'Deshabilitado'}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className={settings.enableTableOrdering ? 'text-green-600' : 'text-gray-400'}>
              {settings.enableTableOrdering ? '✓' : '○'}
            </span>
            <span>
              Órdenes desde mesa: {settings.enableTableOrdering ? 'Habilitado' : 'Deshabilitado'}
            </span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            fetchSettings();
            setError('');
            setSuccess('');
          }}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </form>
  );
}
