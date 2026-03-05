import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoDefault from '../../assets/images/logo-azulanza.png';
import { supabase } from '../../lib/supabase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadLogo = async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'logo_url').limit(1);
      if (data && data.length > 0) setLogoUrl(data[0].value as string);
    };
    loadLogo();
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Sobre Nosotros', path: '/nosotros' },
    { name: 'Asesoría Psicológica', path: '/asesoria' },
    { name: 'Donaciones', path: '/donaciones' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Contacto', path: '/contacto' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Variantes de animación
  const menuItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }
    })
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo con animación sutil al scroll */}
        <Link to="/" className="flex items-center gap-2 relative z-50 group" onClick={() => setIsOpen(false)}>
          <motion.img 
            src={logoUrl || logoDefault} 
            alt="Fundación Azulanza" 
            className={`w-auto object-contain transition-all duration-500 ${scrolled ? 'h-12' : 'h-16 md:h-20'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </Link>

        {/* Desktop Menu - Estilo Isla Flotante */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="flex space-x-1 items-center bg-white/70 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/40 shadow-sm hover:shadow-md transition-shadow duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full z-10 ${
                  isActive(link.path) ? 'text-primary-blue' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-blue-100 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Botón de Acción (Donar) con efecto de brillo */}
        <div className="hidden lg:block relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
          <Link
            to="/donaciones"
            className="relative flex items-center px-6 py-2.5 bg-primary-blue text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all duration-300 transform group-hover:scale-[1.02] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <HeartIcon className="w-4 h-4 fill-current animate-pulse" />
              Donar Ahora
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 focus:outline-none relative z-50 p-2.5 bg-white/80 rounded-full backdrop-blur-sm shadow-sm border border-gray-100 hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu Overlay - Full Screen Glassmorphism */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/90 z-40 lg:hidden flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-sm px-6 flex flex-col space-y-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  custom={i}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    to={link.path}
                    className={`text-2xl font-bold block text-center py-2 transition-colors ${
                      isActive(link.path) 
                        ? 'text-primary-blue scale-110' 
                        : 'text-gray-800 hover:text-primary-blue'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                variants={menuItemVariants}
                custom={navLinks.length}
                initial="closed"
                animate="open"
                exit="closed"
                className="pt-8 flex justify-center"
              >
                <Link
                  to="/donaciones"
                  className="px-8 py-4 bg-primary-blue text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all w-full text-center flex items-center justify-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <HeartIcon className="w-5 h-5 fill-current" />
                  Hacer una Donación
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Componente simple para el icono de corazón (para evitar conflictos de importación si no existe en lucide)
const HeartIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export default Navbar;
