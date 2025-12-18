'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@yumyum/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
          <p className="text-gray-600 mt-2">Inicia sesión para gestionar tu restaurante</p>
        </div>

        <Card className="shadow-xl border-sky-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">Recordarme</span>
                </label>
                <Link href="/forgot-password" className="text-sky-600 hover:text-sky-700">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o</span>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link href="/register" className="text-sky-600 hover:text-sky-700 font-medium">
                  Regístrate aquí
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                  Usuarios de prueba:
                  <br />
                  <span className="font-mono">owner@demo-restaurant.com / Admin123!</span>
                </p>
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
