import { motion } from 'framer-motion';
import { Gift, HandHeart, HeartHandshake, Sparkles, Users } from 'lucide-react';
import { VolunteerForm } from '../components/Forms';

const Volunteers = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative py-20 bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/80"></div>
        <div className="container-custom relative z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Únete a Nuestro Equipo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            Tu tiempo y talento pueden transformar vidas. Conviértete en voluntario y sé parte del cambio.
          </motion.p>
        </div>
      </section>

      <div className="container-custom py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-primary-pink rounded-full font-bold text-sm uppercase tracking-wider mb-6">
              <Sparkles size={16} />
              Haz la diferencia
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">¿Por qué ser voluntario?</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Ser voluntario en Fundación Azulanza es una oportunidad única para crecer personal y profesionalmente mientras ayudas a quienes más lo necesitan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: HandHeart, title: "Impacto Directo", desc: "Verás cómo tu ayuda mejora la vida de las personas en tiempo real." },
                { icon: Users, title: "Comunidad", desc: "Conocerás a personas increíbles con tus mismos valores." },
                { icon: Gift, title: "Desarrollo", desc: "Adquirirás nuevas habilidades y experiencias enriquecedoras." },
                { icon: HeartHandshake, title: "Satisfacción", desc: "La alegría de dar es la mayor recompensa que recibirás." }
              ].map((benefit, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-blue shadow-sm mb-4">
                    <benefit.icon size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Formulario de Registro</h3>
            <p className="text-gray-500 text-center mb-8">Completa tus datos y nos pondremos en contacto contigo.</p>
            <VolunteerForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;
