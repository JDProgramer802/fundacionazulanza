import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../context/AuthContext';

// Hook personalizado para acceder al contexto de autenticación de forma sencilla.
// Debe usarse dentro de un AuthProvider.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
