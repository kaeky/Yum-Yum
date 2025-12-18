import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YumYum - Reservas de Restaurantes',
  description: 'Sistema de reservas, menú digital y pre-orden para restaurantes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
