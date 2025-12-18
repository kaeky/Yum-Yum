'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@yumyum/ui';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Restaurantes', href: '/dashboard/restaurants', icon: '🏪' },
  { name: 'Usuarios', href: '/dashboard/users', icon: '👥' },
  { name: 'Planes', href: '/dashboard/plans', icon: '💎' },
  { name: 'Facturación', href: '/dashboard/billing', icon: '💳' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { name: 'Soporte', href: '/dashboard/support', icon: '💬' },
  { name: 'Configuración', href: '/dashboard/settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            Y
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">YumYum</h1>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@yumyum.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
