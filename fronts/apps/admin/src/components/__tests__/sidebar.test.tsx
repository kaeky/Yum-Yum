import { render, screen } from '@testing-library/react';
import { Sidebar } from '../sidebar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}));

describe('Sidebar', () => {
  it('should render the YumYum logo', () => {
    render(<Sidebar />);

    const logo = screen.getByText('YumYum');
    expect(logo).toBeInTheDocument();
  });

  it('should render all navigation items', () => {
    render(<Sidebar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Restaurantes')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Planes')).toBeInTheDocument();
    expect(screen.getByText('Facturación')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Soporte')).toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();
  });

  it('should highlight active navigation item', () => {
    render(<Sidebar />);

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-blue-50', 'text-blue-700');
  });

  it('should display user profile', () => {
    render(<Sidebar />);

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@yumyum.com')).toBeInTheDocument();
  });
});
