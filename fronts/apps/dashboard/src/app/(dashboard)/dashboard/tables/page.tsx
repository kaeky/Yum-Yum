'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, Label } from '@yumyum/ui';

interface Restaurant {
  id: string;
  name: string;
}

interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  section: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out_of_service';
  positionX?: number;
  positionY?: number;
  restaurant: Restaurant;
}

const statusLabels = {
  available: { label: 'Disponible', color: 'bg-green-100 text-green-800' },
  occupied: { label: 'Ocupada', color: 'bg-red-100 text-red-800' },
  reserved: { label: 'Reservada', color: 'bg-blue-100 text-blue-800' },
  cleaning: { label: 'Limpieza', color: 'bg-yellow-100 text-yellow-800' },
  out_of_service: { label: 'Fuera de Servicio', color: 'bg-gray-100 text-gray-800' },
};

export default function TablesPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: '4',
    section: 'Main',
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchTables();
    }
  }, [selectedRestaurant]);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants/my-restaurants');
      if (response.data.success) {
        const rests = response.data.data.restaurants;
        setRestaurants(rests);
        if (rests.length > 0) {
          setSelectedRestaurant(rests[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/${selectedRestaurant}/tables`);
      if (response.data.success) {
        setTables(response.data.data.tables);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(`/restaurants/${selectedRestaurant}/tables`, {
        ...newTable,
        capacity: parseInt(newTable.capacity),
      });

      if (response.data.success) {
        setTables([...tables, response.data.data.table]);
        setShowCreateModal(false);
        setNewTable({ tableNumber: '', capacity: '4', section: 'Main' });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al crear mesa');
    }
  };

  const updateTableStatus = async (tableId: string, newStatus: Table['status']) => {
    try {
      await api.patch(`/restaurants/${selectedRestaurant}/tables/${tableId}`, {
        status: newStatus,
      });

      setTables(tables.map(t => (t.id === tableId ? { ...t, status: newStatus } : t)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const deleteTable = async (tableId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta mesa?')) return;

    try {
      await api.delete(`/restaurants/${selectedRestaurant}/tables/${tableId}`);
      setTables(tables.filter(t => t.id !== tableId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar mesa');
    }
  };

  const groupedTables = tables.reduce(
    (acc, table) => {
      if (!acc[table.section]) {
        acc[table.section] = [];
      }
      acc[table.section].push(table);
      return acc;
    },
    {} as Record<string, Table[]>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Mesas</h1>
          <p className="text-gray-600 mt-1">Administra las mesas de tu restaurante</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="lg">
          + Nueva Mesa
        </Button>
      </div>

      {/* Restaurant Selector */}
      {restaurants.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <Label htmlFor="restaurant">Seleccionar Restaurante</Label>
            <select
              id="restaurant"
              value={selectedRestaurant}
              onChange={e => setSelectedRestaurant(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            >
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
            <p className="text-sm text-gray-600">Total Mesas</p>
          </CardContent>
        </Card>
        {Object.entries(statusLabels).map(([status, { label, color }]) => (
          <Card key={status}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {tables.filter(t => t.status === status).length}
              </p>
              <p className={`text-sm font-medium ${color.split(' ')[1]}`}>{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tables by Section */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : Object.keys(groupedTables).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🪑</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay mesas registradas</h3>
            <p className="text-gray-600 mb-6">Crea tu primera mesa para comenzar</p>
            <Button onClick={() => setShowCreateModal(true)}>Crear Primera Mesa</Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedTables).map(([section, sectionTables]) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sección: {section}</span>
                <Badge variant="secondary">{sectionTables.length} mesas</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sectionTables.map(table => (
                  <div
                    key={table.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">Mesa {table.tableNumber}</p>
                        <p className="text-sm text-gray-600">
                          Capacidad: {table.capacity} personas
                        </p>
                      </div>
                      <button
                        onClick={() => deleteTable(table.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          statusLabels[table.status].color
                        }`}
                      >
                        {statusLabels[table.status].label}
                      </span>
                    </div>

                    <select
                      value={table.status}
                      onChange={e => updateTableStatus(table.id, e.target.value as Table['status'])}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="available">Disponible</option>
                      <option value="occupied">Ocupada</option>
                      <option value="reserved">Reservada</option>
                      <option value="cleaning">Limpieza</option>
                      <option value="out_of_service">Fuera de Servicio</option>
                    </select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nueva Mesa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTable} className="space-y-4">
                <div>
                  <Label htmlFor="tableNumber">Número de Mesa *</Label>
                  <Input
                    id="tableNumber"
                    value={newTable.tableNumber}
                    onChange={e => setNewTable({ ...newTable, tableNumber: e.target.value })}
                    required
                    placeholder="1, 2, A1, B3..."
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Capacidad *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="20"
                    value={newTable.capacity}
                    onChange={e => setNewTable({ ...newTable, capacity: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="section">Sección *</Label>
                  <Input
                    id="section"
                    value={newTable.section}
                    onChange={e => setNewTable({ ...newTable, section: e.target.value })}
                    required
                    placeholder="Main, Terraza, VIP..."
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Crear Mesa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
