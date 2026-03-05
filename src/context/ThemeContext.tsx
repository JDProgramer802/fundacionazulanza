import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

// Tipos de tema soportados
export type Theme = 'light' | 'dark' | 'system';

// Interfaz del contexto
export interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

// Contexto inicial por defecto
export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {}
});

// Proveedor de tema que maneja el cambio de clases CSS y persistencia en localStorage
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Cargar tema guardado o usar 'system' por defecto
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return (saved as Theme) || 'system';
    }
    return 'system';
  });

  // Aplica las clases dark/light al elemento <html> y <body>
  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    const isDark =
      t === 'dark' ||
      (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Limpiar clases previas
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    // Aplicar nuevas clases
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.add('light');
      body.classList.add('light');
    }
  }, []);

  // Actualizar tema cuando cambia el estado
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme, applyTheme]);

  // Escuchar cambios en la preferencia del sistema operativo si el tema es 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
