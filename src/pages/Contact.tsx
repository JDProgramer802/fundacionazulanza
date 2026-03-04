import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '../components/Forms';

const Contact = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="container-custom relative z-10 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Contáctanos
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Estamos aquí para escucharte. Escríbenos, llámanos o visítanos.
          </motion.p>
        </div>
      </section>

      <div className="container-custom py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 h-full">
              <h3 className="text-2xl font-bold text-primary-blue mb-8">Información de Contacto</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-blue shadow-sm group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Ubicación</h4>
                    <p className="text-gray-600">Calle 123 # 45-67, Barrio La Esperanza<br />Ciudad, País</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-pink shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Teléfono</h4>
                    <p className="text-gray-600">+57 300 123 4567<br />+57 601 234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Correo Electrónico</h4>
                    <p className="text-gray-600">contacto@fundacionazulanza.org<br />info@fundacionazulanza.org</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-blue-100">
                <h4 className="font-bold text-gray-800 mb-4">Horario de Atención</h4>
                <p className="text-gray-600">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Sábados: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </motion.div>

          {/* Form and Map */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un Mensaje</h3>
              <ContactForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl overflow-hidden shadow-lg h-80 border border-gray-100"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.923456789!2d-74.081750!3d4.609710!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcszNiMzNi45Ik4gNzTCsDA0JzU0LjMiVw!5e0!3m2!1ses!2sco!4v1614123456789!5m2!1ses!2sco" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Mapa de ubicación"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
