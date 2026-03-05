import type { Session, User } from '@supabase/supabase-js';
import { createContext } from 'react';

// Interfaz que define la forma del contexto de autenticación.
export interface AuthContextType {
  session: Session | null; // Sesión actual de Supabase
  user: User | null; // Usuario autenticado
  loading: boolean; // Estado de carga
  logout: () => Promise<void>; // Función para cerrar sesión
}

// Contexto de React para manejar el estado de autenticación global.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
