import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminLogin from '../pages/Admin/Login';
import AdminRegister from '../pages/Admin/Register';
import { supabase } from '../lib/supabase';
import { ToastContainer } from 'react-toastify';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}));

// Mock useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    session: null,
    loading: false,
    logout: vi.fn(),
  }),
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Component', () => {
    it('renders login form correctly', () => {
      render(
        <BrowserRouter>
          <AdminLogin />
        </BrowserRouter>
      );
      
      expect(screen.getByText('Acceso Administrativo')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('admin@azulanza.org')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      render(
        <BrowserRouter>
          <AdminLogin />
          <ToastContainer />
        </BrowserRouter>
      );
      
      const submitButton = screen.getByRole('button', { name: /ingresar/i });
      fireEvent.click(submitButton);
      
      // HTML5 validation prevents submission if empty, but let's check if function is NOT called
      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it('calls supabase signIn with correct credentials', async () => {
      render(
        <BrowserRouter>
          <AdminLogin />
        </BrowserRouter>
      );
      
      const emailInput = screen.getByPlaceholderText('admin@azulanza.org');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByRole('button', { name: /ingresar/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
  });

  describe('Register Component', () => {
    it('renders register form correctly', () => {
      render(
        <BrowserRouter>
          <AdminRegister />
        </BrowserRouter>
      );
      
      expect(screen.getByText('Crear Cuenta Administrativa')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('nombre@azulanza.org')).toBeInTheDocument();
    });

    it('validates password match', async () => {
      render(
        <BrowserRouter>
          <AdminRegister />
          <ToastContainer />
        </BrowserRouter>
      );
      
      const passwordInput = screen.getByPlaceholderText('Mínimo 8 caracteres');
      const confirmInput = screen.getByPlaceholderText('Repite tu contraseña');
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'different' } });
      fireEvent.click(submitButton);

      expect(supabase.auth.signUp).not.toHaveBeenCalled();
      // Toast should appear (mocked or DOM check)
    });

    it('calls supabase signUp on success', async () => {
      // Mock successful response
      vi.mocked(supabase.auth.signUp).mockResolvedValue({ 
        data: { user: { id: '123' } as any, session: null }, 
        error: null 
      });

      render(
        <BrowserRouter>
          <AdminRegister />
        </BrowserRouter>
      );
      
      const emailInput = screen.getByPlaceholderText('nombre@azulanza.org');
      const passwordInput = screen.getByPlaceholderText('Mínimo 8 caracteres');
      const confirmInput = screen.getByPlaceholderText('Repite tu contraseña');
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

      fireEvent.change(emailInput, { target: { value: 'newadmin@azulanza.org' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'newadmin@azulanza.org',
          password: 'password123',
          options: {
            data: {
              full_name: 'newadmin',
              role: 'admin',
            },
          },
        });
      });
    });
  });
});
