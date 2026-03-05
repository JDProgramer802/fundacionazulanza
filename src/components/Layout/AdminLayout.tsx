import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  FileText,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Presentation,
  Search,
  Settings,
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
    { name: 'Noticias', path: '/admin/noticias', icon: FileText },
    { name: 'Hero Slider', path: '/admin/hero', icon: Presentation },
    { name: 'Asesorías', path: '/admin/asesorias', icon: Users },
    { name: 'Voluntarios', path: '/admin/voluntarios', icon: User },
    { name: 'Usuarios', path: '/admin/usuarios', icon: Shield },
    { name: 'Galería', path: '/admin/galeria', icon: ImageIcon },
    { name: 'Donaciones', path: '/admin/donaciones', icon: Heart },
    { name: 'Ajustes', path: '/admin/ajustes', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex font-sans text-gray-800 dark:text-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30">
        <div className="p-8 flex items-center justify-center border-b border-gray-50 dark:border-gray-800/50">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={logoUrl || logoDefault} alt="Fundación Azulanza" className="h-14 w-auto object-contain" />
          </Link>
        </div>

        <div className="p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          <div className="mb-8">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu Principal</p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive(item.path)
                      ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-primary-blue dark:hover:text-blue-400'
                  }`}
                >
                  <item.icon
                    size={20}
                    className={`relative z-10 transition-transform duration-300 ${
                      isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="font-medium relative z-10">{item.name}</span>

                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {!isActive(item.path) && (
                    <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 text-gray-400" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-6 border-t border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3 mb-4 p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {user?.user_metadata?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user?.user_metadata?.full_name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">Administrador</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <img src={logoUrl || logoDefault} alt="Logo" className="h-8 w-auto" />
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
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
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <img src={logoUrl || logoDefault} alt="Logo" className="h-10 w-auto" />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                        isActive(item.path)
                          ? 'bg-primary-blue text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold">
                    {user?.user_metadata?.full_name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{user?.user_metadata?.full_name || 'Admin'}</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-600 rounded-xl font-medium shadow-sm"
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
