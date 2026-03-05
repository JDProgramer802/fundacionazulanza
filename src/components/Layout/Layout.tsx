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
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen font-sans relative">
      <Navbar />
      
      {/* Contenido principal.
          Si es Home, no añadimos padding superior para que el Hero ocupe todo.
          En otras páginas, añadimos pt-20 o pt-24 para compensar el Navbar fijo. 
      */}
      <main className={`flex-grow ${!isHome ? 'pt-24 md:pt-28' : ''}`}>
        {children}
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Layout;
