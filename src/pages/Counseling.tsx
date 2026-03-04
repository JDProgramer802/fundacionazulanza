import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { CounselingForm } from '../components/Forms';

const Counseling = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative py-20 bg-pink-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-primary-blue/10 skew-x-12 transform -translate-x-20"></div>
        <div className="container-custom relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-primary-pink mb-6"
          >
            Asesoría Psicológica
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Un espacio seguro, confidencial y profesional para tu bienestar emocional.
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
            <h2 className="text-3xl font-bold text-gray-800 mb-6">¿Cómo podemos ayudarte?</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Sabemos que dar el primer paso no es fácil. Nuestro equipo de psicólogos profesionales está aquí para escucharte y acompañarte en tu proceso, brindándote herramientas para enfrentar los desafíos de la vida.
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: ShieldCheck, title: "Confidencialidad Garantizada", desc: "Todo lo que hables con nosotros queda en estricta reserva." },
                { icon: Calendar, title: "Horarios Flexibles", desc: "Adaptamos las sesiones a tu disponibilidad, presencial o virtual." },
                { icon: MessageCircle, title: "Atención Personalizada", desc: "Cada persona es única, y nuestro enfoque también lo es." }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary-blue">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Áreas de Atención</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Ansiedad y Estrés", "Depresión", "Duelo", "Problemas de Pareja", "Autoestima", "Orientación Familiar"].map((area, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 size={18} className="text-green-500" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 relative"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary-pink/20 rounded-full blur-2xl -z-10"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Solicita tu Cita</h3>
            <CounselingForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Counseling;
