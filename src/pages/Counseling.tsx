import { motion } from 'framer-motion';
import { Brain, Calendar, CheckCircle2, HeartHandshake, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { CounselingForm } from '../components/Forms';

const Counseling = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Espacio Seguro",
      desc: "Tu privacidad es nuestra prioridad. Todo lo compartido es estrictamente confidencial.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: HeartHandshake,
      title: "Acompañamiento",
      desc: "No estás solo. Nuestros profesionales caminan contigo en cada paso del proceso.",
      color: "text-pink-500",
      bg: "bg-pink-50"
    },
    {
      icon: Sparkles,
      title: "Enfoque Integral",
      desc: "Tratamos mente, cuerpo y emociones para un bienestar completo y duradero.",
      color: "text-purple-500",
      bg: "bg-purple-50"
    }
  ];

  const areas = [
    "Manejo de Ansiedad", "Depresión", "Duelo y Pérdida",
    "Conflictos de Pareja", "Autoestima", "Orientación Familiar",
    "Estrés Laboral", "Crecimiento Personal"
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 fixed-bg"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-purple-900/90 to-blue-900/80"></div>

        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-sm font-bold mb-6">
                <Brain size={18} />
                Salud Mental y Bienestar
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                Tu bienestar emocional es <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">nuestra prioridad</span>
              </h1>
              <p className="text-xl text-indigo-100/90 leading-relaxed font-light mb-8">
                Ofrecemos un espacio profesional, empático y libre de juicios donde puedes encontrar las herramientas para transformar tu vida.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container-custom py-16 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column: Info & Benefits */}
          <div className="lg:col-span-7 space-y-8">
            {/* Introduction Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Por qué elegirnos?</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Entendemos que buscar ayuda es un acto de valentía. Nuestro equipo de psicólogos clínicos está comprometido con brindarte una atención de calidad, humana y accesible.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl ${item.bg} border border-transparent hover:border-gray-100 transition-colors`}>
                    <item.icon className={`${item.color} mb-3`} size={32} />
                    <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Areas of Focus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl border border-indigo-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Podemos apoyarte en:</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {areas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white text-gray-700 rounded-xl text-sm font-semibold shadow-sm border border-gray-100 flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-default"
                  >
                    <CheckCircle2 size={16} className="text-green-500" />
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-indigo-900/5 border border-gray-100 sticky top-24"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                  <Calendar size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Agenda tu Cita</h3>
                <p className="text-gray-500 mt-2 text-sm">Déjanos tus datos y te contactaremos para coordinar tu primera sesión.</p>
              </div>

              <CounselingForm />

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  * Tu información está protegida bajo secreto profesional.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Counseling;
