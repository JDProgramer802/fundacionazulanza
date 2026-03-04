import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo-azulanza.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-50" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="Fundación Azulanza" className="h-12 md:h-16 w-auto object-contain transition-all" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-1 items-center bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full hover:text-primary-blue ${
                isActive(link.path) ? 'text-primary-blue' : 'text-gray-600'
              }`}
            >
              {isActive(link.path) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-blue-50 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/donaciones"
            className="btn-primary transform hover:scale-105 transition-transform shadow-blue-300/50 shadow-lg"
          >
            Donar Ahora
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary-blue focus:outline-none relative z-50 p-2 bg-white/80 rounded-full backdrop-blur-sm shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 md:hidden flex flex-col items-center justify-center space-y-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-2xl font-bold ${
                  isActive(link.path) ? 'text-primary-blue' : 'text-gray-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/donaciones"
              className="btn-primary text-xl px-8 py-3 shadow-xl shadow-blue-300/50"
              onClick={() => setIsOpen(false)}
            >
              Donar Ahora
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
