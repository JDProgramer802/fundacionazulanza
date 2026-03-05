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
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link to="/">
          <img src={logoUrl || logoDefault} alt="Fundación Azulanza" className="h-14 w-auto object-contain" />
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <span className="font-bold text-gray-800 text-lg">Menú</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-blue-50 rounded-xl">
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
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-primary-blue text-white shadow-lg shadow-blue-200'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-primary-blue'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-4 border-t border-gray-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-x-hidden w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
      <ThemeToggle />
    </div>
  );
};

export default AdminLayout;
