'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@yumyum/ui';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: '📊' },
  { name: 'Reservas', href: '/dashboard/reservations', icon: '📅' },
  { name: 'Mesas', href: '/dashboard/tables', icon: '🪑' },
  { name: 'Menú', href: '/dashboard/menu', icon: '🍽️' },
  { name: 'Órdenes', href: '/dashboard/orders', icon: '🛎️' },
  { name: 'Clientes', href: '/dashboard/customers', icon: '👥' },
  { name: 'Marketing', href: '/dashboard/marketing', icon: '📢' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { name: 'Configuración', href: '/dashboard/settings', icon: '⚙️' },
];

const roleLabels = {
  super_admin: 'Super Admin',
  restaurant_owner: 'Propietario',
  restaurant_staff: 'Staff',
  customer: 'Cliente',
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getInitials = () => {
    if (!user) return '??';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const handleLogout = async () => {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      await logout();
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-600 to-cyan-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            Y
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">YumYum</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Restaurant Selector */}
      <div className="p-4 border-b border-gray-200">
        <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg p-3 border border-sky-200">
          <p className="text-xs text-gray-600 mb-1">Restaurante activo</p>
          <p className="font-semibold text-gray-900 text-sm">Seleccionar restaurante</p>
          <Link
            href="/dashboard/restaurants"
            className="text-xs text-sky-600 hover:text-sky-700 mt-1 inline-block"
          >
            Ver mis restaurantes →
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{roleLabels[user.role]}</p>
              </div>
            </button>

            {/* User Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  👤 Mi Perfil
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  ⚙️ Configuración
                </Link>
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">Cargando...</div>
        )}
      </div>
    </aside>
  );
}
