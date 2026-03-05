import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Settings,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    counseling: 0,
    volunteers: 0,
    donations: 0,
    gallery: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: counselingCount } = await supabase.from('counseling_requests').select('*', { count: 'exact', head: true });
      const { count: volunteersCount } = await supabase.from('volunteers').select('*', { count: 'exact', head: true });
      const { count: galleryCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });

      const { data: donationsData } = await supabase
        .from('donations')
        .select('amount')
        .eq('status', 'Completado');

      const totalDonations = donationsData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

      setStats({
        counseling: counselingCount || 0,
        volunteers: volunteersCount || 0,
        donations: totalDonations,
        gallery: galleryCount || 0
      });
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Solicitudes de Asesoría',
      value: stats.counseling,
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/20',
      trend: '+12% este mes'
    },
    {
      title: 'Voluntarios Activos',
      value: stats.volunteers,
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      shadow: 'shadow-pink-500/20',
      trend: '+5% este mes'
    },
    {
      title: 'Donaciones Totales',
      value: `$${stats.donations.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/20',
      trend: '+18% este mes'
    },
    {
      title: 'Imágenes en Galería',
      value: stats.gallery,
      icon: ImageIcon,
      color: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-purple-500/20',
      trend: '+2 nuevas'
    },
  ];

  const quickActions = [
    { name: 'Nueva Noticia', icon: Plus, path: '/admin/paginas', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Subir Foto', icon: ImageIcon, path: '/admin/galeria', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { name: 'Ver Asesorías', icon: Calendar, path: '/admin/asesorias', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { name: 'Configuración', icon: Settings, path: '/admin/ajustes', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.user_metadata?.full_name?.split(' ')[0] || 'Admin'}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Aquí tienes el resumen de lo que está pasando en la fundación.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${card.shadow}`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                <card.icon size={24} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
              <span className="flex items-center text-green-500 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-lg">
                <ArrowUpRight size={14} className="mr-1" />
                {card.trend}
              </span>
              <span className="text-gray-400 text-xs">vs mes anterior</span>
            </div>

            {/* Decorative Background */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Activity size={20} className="text-blue-500" />
              Acciones Rápidas
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.path}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 group"
              >
                <div className={`p-4 rounded-2xl mb-3 transition-transform group-hover:scale-110 ${action.color}`}>
                  <action.icon size={28} />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{action.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Actividad Reciente (Simulada)</h3>
            <div className="space-y-4">
              {[
                { text: 'Nuevo voluntario registrado: Ana María', time: 'Hace 5 min', color: 'bg-green-500' },
                { text: 'Solicitud de asesoría #124 recibida', time: 'Hace 2 horas', color: 'bg-blue-500' },
                { text: 'Donación de $50.000 recibida', time: 'Hace 4 horas', color: 'bg-yellow-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">{item.text}</p>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini Banner / Tips */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
              <Heart className="text-white fill-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Recuerda revisar las solicitudes pendientes</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Hay personas esperando respuesta en el módulo de asesorías. Mantener el tiempo de respuesta bajo mejora nuestra confianza.
            </p>
            <Link
              to="/admin/asesorias"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
            >
              Ir a Asesorías <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
