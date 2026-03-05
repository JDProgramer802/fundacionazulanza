import { createClient } from '@supabase/supabase-js';

// Cliente de Supabase configurado para la aplicación.
// Asegúrate de que las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén definidas.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
