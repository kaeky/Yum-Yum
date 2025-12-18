'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@yumyum/ui';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl mb-4 shadow-xl">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">YumYum Admin</h1>
          <p className="text-gray-600 mt-2">Panel de Administración</p>
        </div>

        <Card className="shadow-xl border-purple-100">
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
                  placeholder="admin@yumyum.com"
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
                <Link href="/forgot-password" className="text-purple-600 hover:text-purple-700">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <div className="pt-4 border-t border-gray-200">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    ⚠️ <strong>Acceso Restringido</strong>
                    <br />
                    Solo usuarios con rol de Super Admin pueden acceder a este panel.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-center text-gray-500">
                  Usuario de prueba:
                  <br />
                  <span className="font-mono">admin@yumyum.com / Admin123!</span>
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
