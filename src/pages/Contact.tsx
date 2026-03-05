import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ContactForm } from '../components/Forms';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => { map[s.key] = s.value || ''; });
        setSettings(map);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header con Parallax y Overlay */}
      <section className="relative py-28 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center fixed-bg opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/90"></div>

        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-4 backdrop-blur-sm">
              Estamos aquí para ti
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Contáctanos
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              Ya sea que quieras ser voluntario, donar o necesites apoyo, nuestro equipo está listo para escucharte.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Tarjeta de Información de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Información</h3>

                <div className="space-y-8">
                  <InfoItem
                    icon={MapPin}
                    color="text-blue-500"
                    bg="bg-blue-50"
                    title="Visítanos"
                    content={<>{settings['address'] || <>Cra. 42 #65 - 27 Local 2, Barrio Recreo<br />Barranquilla, Atlántico</>}</>}
                  />

                  <InfoItem
                    icon={Phone}
                    color="text-pink-500"
                    bg="bg-pink-50"
                    title="Llámanos"
                    content={<>{settings['phone_whatsapp'] ? <>{settings['phone_whatsapp']}</> : <>+57 322 7212546<br />+57 300 123 4567</>}</>}
                  />

                  <InfoItem
                    icon={Mail}
                    color="text-green-500"
                    bg="bg-green-50"
                    title="Escríbenos"
                    content={settings['email_contact'] || "contacto@fundacionazulanza.org"}
                  />

                  <InfoItem
                    icon={Clock}
                    color="text-purple-500"
                    bg="bg-purple-50"
                    title="Horario"
                    content={<>Lun - Vie: 8:00 AM - 6:00 PM<br />Sáb: 9:00 AM - 1:00 PM</>}
                  />
                </div>
              </div>

              <div className="mt-10 p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white text-center shadow-lg shadow-blue-500/30">
                <p className="font-medium mb-3">¿Tienes una emergencia?</p>
                <a href="https://wa.me/573227212546" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-2 bg-white text-blue-600 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* Formulario y Mapa */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <Send size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Envíanos un Mensaje</h3>
                </div>
                <ContactForm />
              </div>
            </motion.div>

            {/* Mapa Interactivo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="h-80 rounded-3xl overflow-hidden shadow-sm border border-gray-200 relative group"
            >
              <iframe
                src={settings['google_maps_embed_url'] || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.327863674686!2d-74.80255562416822!3d10.988916954766863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef42d6507c6da9d%3A0xe7a0c7c880882780!2sCra.%2042%20%2365-27%2C%20Nte.%20Centro%20Historico%2C%20Barranquilla%2C%20Atl%C3%A1ntico!5e0!3m2!1ses!2sco!4v1709665000000!5m2!1ses!2sco"}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                allowFullScreen={true}
                loading="lazy"
                title="Mapa de ubicación"
                className="transition-all duration-700 group-hover:filter-none group-hover:scale-105"
              ></iframe>

              {/* Overlay Glassmorphism en Mapa */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 text-sm font-semibold text-gray-800 pointer-events-none">
                📍 Barrio Recreo
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para ítems de información
const InfoItem = ({ icon: Icon, color, bg, title, content }: { icon: any, color: string, bg: string, title: string, content: React.ReactNode }) => (
  <div className="flex items-start gap-4 group">
    <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={22} />
    </div>
    <div>
      <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-1">{title}</h4>
      <div className="text-gray-600 text-sm leading-relaxed">{content}</div>
    </div>
  </div>
);

export default Contact;
