import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import WhatsAppButton from '../UI/WhatsAppButton';
import Footer from './Footer';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

// Layout principal para las páginas públicas.
// Incluye Navbar, Footer y botón flotante de WhatsApp.
const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  // Páginas que tienen un Hero Section y no necesitan padding superior global
  const hasHero = ['/', '/nosotros', '/galeria', '/donaciones', '/asesoria', '/contacto', '/voluntariado'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen font-sans relative">
      <Navbar />
      
      {/* Contenido principal.
          Si la página tiene Hero, eliminamos el padding superior para que el Hero
          se posicione detrás del Navbar transparente (efecto inmersivo).
          Para otras páginas, mantenemos el padding para evitar que el contenido quede oculto.
      */}
      <main className={`flex-grow ${!hasHero ? 'pt-24 md:pt-28' : ''}`}>
        {children}
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Layout;
