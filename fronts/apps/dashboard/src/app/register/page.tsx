'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@yumyum/ui';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: 'restaurant_owner', // Default role for dashboard registration
      });
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-600 to-cyan-700 rounded-2xl mb-4 shadow-xl">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">YumYum Dashboard</h1>
          <p className="text-gray-600 mt-2">Crea tu cuenta para empezar</p>
        </div>

        <Card className="shadow-xl border-sky-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Pérez"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                La contraseña debe tener al menos:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>8 caracteres</li>
                  <li>Una letra mayúscula</li>
                  <li>Una letra minúscula</li>
                  <li>Un número o carácter especial</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                  Inicia sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
