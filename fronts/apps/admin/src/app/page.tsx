import Link from 'next/link';
import { Button } from '@yumyum/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold">
              Y
            </div>
            <span className="text-xl font-bold text-gray-900">YumYum Admin</span>
          </div>
          <Link href="/dashboard">
            <Button>Ir al Dashboard →</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-8 shadow-xl">
            <span className="text-4xl">🍽️</span>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Panel de Super
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Administración
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Gestiona todos los restaurantes, usuarios, planes y facturación de YumYum desde un solo
            lugar.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8">
                Acceder al Dashboard
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base px-8">
              Ver Documentación
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { icon: '🏪', label: 'Gestión de Restaurantes' },
              { icon: '👥', label: 'Control de Usuarios' },
              { icon: '💎', label: 'Planes y Suscripciones' },
              { icon: '📊', label: 'Analytics Globales' },
              { icon: '💳', label: 'Facturación' },
              { icon: '💬', label: 'Soporte' },
              { icon: '⚙️', label: 'Configuración' },
              { icon: '🔒', label: 'Seguridad' },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <p className="text-sm font-medium text-gray-700">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
