import { motion } from 'framer-motion';
import { Award, HandHeart, Heart, Lightbulb, Sparkles, Target, Users } from 'lucide-react';

const About = () => {
  const values = [
    { icon: Heart, title: "Empatía", desc: "Sentimos y comprendemos profundamente las necesidades de los demás.", color: "text-pink-500", bg: "bg-pink-50" },
    { icon: Lightbulb, title: "Transparencia", desc: "Actuamos con honestidad y claridad en cada recurso gestionado.", color: "text-yellow-500", bg: "bg-yellow-50" },
    { icon: Users, title: "Solidaridad", desc: "La unión hace la fuerza para transformar vidas y comunidades.", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Award, title: "Compromiso", desc: "Dedicación total a nuestra causa y al bienestar de nuestros beneficiarios.", color: "text-purple-500", bg: "bg-purple-50" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 fixed-bg"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/80"></div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-bold mb-6">
              <Users size={18} />
              Conoce nuestra esencia
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Más que una fundación, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-pink-300">somos una familia</span>
            </h1>
            <p className="text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-light">
              Descubre la historia, la misión y el corazón humano detrás de Fundación Azulanza.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History & Story */}
      <section className="py-20 container-custom -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] lg:h-auto"
            >
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Equipo trabajando"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="font-bold text-lg">Fundado en 2020</p>
                  <p className="text-sm text-gray-300">Barranquilla, Colombia</p>
                </div>
              </div>
            </motion.div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Nuestra Historia</h2>
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Fundación Azulanza nació en 2020 como respuesta a la creciente necesidad de apoyo emocional y recursos básicos en comunidades vulnerables. Lo que comenzó como un pequeño grupo de amigos repartiendo alimentos, se transformó en una organización estructurada enfocada en la salud mental y el bienestar integral.
                </p>
                <p>
                  Creemos que cada persona merece ser escuchada y apoyada. Nuestro nombre, <strong className="text-blue-600">"Azulanza"</strong>, evoca la calma del azul y la esperanza de avanzar, simbolizando el refugio seguro que queremos ser para todos.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-blue-600">3+</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Años</span>
                </div>
                <div className="text-center border-l border-gray-100">
                  <span className="block text-3xl font-bold text-pink-500">500+</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Familias</span>
                </div>
                <div className="text-center border-l border-gray-100">
                  <span className="block text-3xl font-bold text-purple-500">20+</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Voluntarios</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 p-10 rounded-3xl shadow-lg text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
              <p className="text-blue-100 leading-relaxed text-lg">
                Brindar asistencia integral a personas en situación de vulnerabilidad, enfocándonos en la salud mental, la seguridad alimentaria y el desarrollo comunitario, promoviendo la dignidad y el empoderamiento personal.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-50 rounded-tr-full -translate-x-1/2 translate-y-1/2 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Visión</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Ser reconocidos como un referente de solidaridad y transformación social, construyendo una red de apoyo sostenible donde la salud mental sea accesible para todos, sin importar su condición socioeconómica.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-2 block">Nuestros Pilares</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Los valores que nos mueven</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${value.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon size={28} className={value.color} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">¿Quieres ser parte del cambio?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Únete a nuestra familia de voluntarios o apoya nuestra causa con una donación. Cada acción cuenta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <HandHeart size={20} />
              Quiero ser Voluntario
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Heart size={20} />
              Hacer una Donación
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
