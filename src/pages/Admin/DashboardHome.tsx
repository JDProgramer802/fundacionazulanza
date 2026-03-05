import { motion } from 'framer-motion';
import { Activity, DollarSign, Heart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const DashboardHome = () => {
  // Estado para contadores del dashboard
  const [stats, setStats] = useState({
    counseling: 0,
    volunteers: 0,
    donations: 0,
    gallery: 0
  });

  useEffect(() => {
    // Cargar estadísticas desde la base de datos
    const fetchStats = async () => {
      // Usamos count: 'exact' y head: true para obtener solo el número de registros sin traer los datos
      const { count: counselingCount } = await supabase.from('counseling_requests').select('*', { count: 'exact', head: true });
      const { count: volunteersCount } = await supabase.from('volunteers').select('*', { count: 'exact', head: true });
      const { count: galleryCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
      
      // Calcular total de donaciones sumando el campo 'amount' de donaciones completadas
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

  // Configuración de tarjetas informativas
  const cards = [
    { 
      title: 'Solicitudes de Asesoría', 
      value: stats.counseling, 
      icon: Users, 
      color: 'bg-blue-500', 
      lightColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Voluntarios Registrados', 
      value: stats.volunteers, 
      icon: Heart, 
      color: 'bg-pink-500', 
      lightColor: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400'
    },
    { 
      title: 'Donaciones Recibidas', 
      value: `$${stats.donations.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-green-500', 
      lightColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      title: 'Imágenes en Galería', 
      value: stats.gallery, 
      icon: Activity, 
      color: 'bg-purple-500', 
      lightColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Panel de Control</h1>
          <p className="text-gray-500 dark:text-gray-400">Resumen general de la actividad de la fundación.</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.lightColor} ${card.textColor}`}>
                <card.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.lightColor} ${card.textColor}`}>
                Activo
              </span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Aquí se pueden añadir más widgets como gráficos o tablas recientes */}
    </div>
  );
};

export default DashboardHome;
