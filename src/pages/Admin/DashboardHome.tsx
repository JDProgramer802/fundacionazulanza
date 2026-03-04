import { motion } from 'framer-motion';
import { Activity, DollarSign, Heart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    counseling: 0,
    volunteers: 0,
    donations: 0,
    gallery: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Simulación de carga o consultas reales
      // En un caso real haríamos count() a cada tabla
      const { count: counselingCount } = await supabase.from('counseling_requests').select('*', { count: 'exact', head: true });
      const { count: volunteersCount } = await supabase.from('volunteers').select('*', { count: 'exact', head: true });
      const { count: galleryCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
      
      // Donaciones simuladas si no hay tabla real o datos
      const donationsCount = 1250; 

      setStats({
        counseling: counselingCount || 0,
        volunteers: volunteersCount || 0,
        donations: donationsCount,
        gallery: galleryCount || 0
      });
    };

    fetchStats();
  }, []);

  const cards = [
    { 
      title: 'Solicitudes de Asesoría', 
      value: stats.counseling, 
      icon: Users, 
      color: 'bg-blue-500', 
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Voluntarios Registrados', 
      value: stats.volunteers, 
      icon: Heart, 
      color: 'bg-pink-500', 
      lightColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    { 
      title: 'Donaciones Recibidas', 
      value: `$${stats.donations}`, 
      icon: DollarSign, 
      color: 'bg-green-500', 
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      title: 'Imágenes en Galería', 
      value: stats.gallery, 
      icon: Activity, 
      color: 'bg-purple-500', 
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500">Resumen general de la actividad de la fundación.</p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
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
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.lightColor} ${card.textColor}`}>
                <card.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.lightColor} ${card.textColor}`}>
                +12% mes
              </span>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  N
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Nueva solicitud de asesoría</p>
                  <p className="text-xs text-gray-500">Hace {i} horas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl border border-gray-100 transition-colors text-center">
              <span className="block font-bold">Crear Slide</span>
            </button>
            <button className="p-4 bg-gray-50 hover:bg-pink-50 hover:text-pink-600 rounded-xl border border-gray-100 transition-colors text-center">
              <span className="block font-bold">Subir Foto</span>
            </button>
            <button className="p-4 bg-gray-50 hover:bg-green-50 hover:text-green-600 rounded-xl border border-gray-100 transition-colors text-center">
              <span className="block font-bold">Registrar Donación</span>
            </button>
            <button className="p-4 bg-gray-50 hover:bg-purple-50 hover:text-purple-600 rounded-xl border border-gray-100 transition-colors text-center">
              <span className="block font-bold">Ver Mensajes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
