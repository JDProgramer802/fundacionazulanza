import type { Session, User } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext';

// Proveedor de autenticación que envuelve la aplicación.
// Gestiona la sesión actual, el usuario y los cambios de estado (login/logout).
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial al cargar la app
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Escuchar cambios en tiempo real (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpiar suscripción al desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
