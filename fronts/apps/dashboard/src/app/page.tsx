import Link from 'next/link';
import { Button } from '@yumyum/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-sky-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-cyan-700 rounded-xl flex items-center justify-center text-white font-bold">
              Y
            </div>
            <span className="text-xl font-bold text-gray-900">YumYum Dashboard</span>
          </div>
          <Link href="/dashboard">
            <Button>Ir al Dashboard →</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-600 to-cyan-700 rounded-2xl mb-8 shadow-xl">
            <span className="text-4xl">🍽️</span>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Gestiona tu
            <br />
            <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              Restaurante
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Panel de control completo para administrar reservas, mesas, órdenes, clientes y mucho
            más. Todo en un solo lugar.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8">
                Acceder al Panel
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base px-8">
              Ver Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-20">
            {[
              { icon: '📅', label: 'Gestión de Reservas', desc: 'Control total de tu calendario' },
              { icon: '🪑', label: 'Administración de Mesas', desc: 'Optimiza tu espacio' },
              { icon: '🛎️', label: 'Órdenes en Tiempo Real', desc: 'Sincronización instantánea' },
              { icon: '👥', label: 'CRM de Clientes', desc: 'Conoce a tus clientes' },
              { icon: '📢', label: 'Marketing Automatizado', desc: 'Campañas por WhatsApp' },
              { icon: '📊', label: 'Analytics Avanzados', desc: 'Reportes y métricas' },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.label}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
