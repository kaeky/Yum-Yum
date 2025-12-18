import { Card, CardContent, CardHeader, CardTitle } from '@yumyum/ui';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Restaurantes Activos',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: '🏪',
    },
    {
      title: 'Usuarios Totales',
      value: '45,678',
      change: '+8.2%',
      trend: 'up',
      icon: '👥',
    },
    {
      title: 'Reservas del Mes',
      value: '23,456',
      change: '+23.1%',
      trend: 'up',
      icon: '📅',
    },
    {
      title: 'Revenue (MRR)',
      value: '$89,234',
      change: '+18.7%',
      trend: 'up',
      icon: '💰',
    },
  ];

  const recentActivity = [
    {
      restaurant: 'La Parrilla Gourmet',
      action: 'Nuevo restaurante registrado',
      time: 'Hace 5 minutos',
      status: 'success',
    },
    {
      restaurant: 'Sushi Master',
      action: 'Plan actualizado a Premium',
      time: 'Hace 1 hora',
      status: 'info',
    },
    {
      restaurant: 'Pasta Bella',
      action: 'Ticket de soporte creado',
      time: 'Hace 2 horas',
      status: 'warning',
    },
    {
      restaurant: 'Burger House',
      action: 'Pago procesado exitosamente',
      time: 'Hace 3 horas',
      status: 'success',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vista general del sistema YumYum</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <Card key={stat.title} className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <span className="mr-1">↑</span>
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      activity.status === 'success'
                        ? 'bg-green-500'
                        : activity.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.restaurant}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Métricas del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Capacidad de Servidor</span>
                  <span className="font-medium text-gray-900">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Uso de Base de Datos</span>
                  <span className="font-medium text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Tasa de Error</span>
                  <span className="font-medium text-gray-900">0.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '3%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
