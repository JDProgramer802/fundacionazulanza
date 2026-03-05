import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '../context/ThemeContext';

// Hook para acceder y modificar el tema actual
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
