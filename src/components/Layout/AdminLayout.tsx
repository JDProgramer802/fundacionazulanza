import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Presentation,
  Shield,
  User,
  Users,
  X
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoDefault from '../../assets/images/logo-azulanza.png';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import ThemeToggle from '../UI/ThemeToggle';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Cargar logo personalizado desde settings al montar
  useEffect(() => {
    const loadLogo = async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'logo_url').limit(1);
      if (data && data.length > 0) setLogoUrl(data[0].value as string);
    };
    loadLogo();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Configuración de los ítems del menú lateral
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Páginas', path: '/admin/paginas', icon: Presentation },
    { name: 'Hero Slider', path: '/admin/hero', icon: Presentation },
    { name: 'Asesorías', path: '/admin/asesorias', icon: Users },
    { name: 'Voluntarios', path: '/admin/voluntarios', icon: User },
    { name: 'Usuarios', path: '/admin/usuarios', icon: Shield },
    { name: 'Galería', path: '/admin/galeria', icon: ImageIcon },
    { name: 'Donaciones', path: '/admin/donaciones', icon: Heart },
    { name: 'Ajustes', path: '/admin/ajustes', icon: LayoutDashboard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans text-gray-800 dark:text-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-screen sticky top-0 shadow-sm z-20">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-center">
          <Link to="/">
            <img src={logoUrl || logoDefault} alt="Fundación Azulanza" className="h-16 w-auto object-contain" />
          </Link>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold text-lg">
              {user?.user_metadata?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{user?.user_metadata?.full_name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'bg-primary-blue text-white shadow-lg shadow-blue-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-blue'
                }`}
              >
                <item.icon
                  size={20}
                  className={`transition-colors ${
                    isActive(item.path) ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-blue'
                  }`}
                />
                <span className="font-medium">{item.name}</span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-primary-blue rounded-r-full"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-50 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 z-20">
        <Link to="/">
          <img src={logoUrl || logoDefault} alt="Fundación Azulanza" className="h-10 w-auto" />
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-40 md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <span className="font-bold text-lg text-gray-800 dark:text-white">Menú</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive(item.path)
                          ? 'bg-primary-blue text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0 md:pl-0 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="fixed bottom-8 right-8 z-50">
                <ThemeToggle />
            </div>
            {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
