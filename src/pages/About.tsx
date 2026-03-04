import { motion } from 'framer-motion';
import { Award, CheckCircle, Heart, Target, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="relative py-20 bg-blue-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-pink/10 -skew-x-12 transform translate-x-20"></div>
        <div className="container-custom relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-primary-blue mb-6"
          >
            Sobre Nosotros
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Conoce la historia, misión y el corazón detrás de Fundación Azulanza.
          </motion.p>
        </div>
      </section>

      {/* History & Story */}
      <section className="py-20">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Equipo fundador" 
              className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-800">Nuestra Historia</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Fundación Azulanza nació en 2020 como respuesta a la creciente necesidad de apoyo emocional y recursos básicos en comunidades vulnerables. Lo que comenzó como un pequeño grupo de amigos repartiendo alimentos, se transformó en una organización estructurada enfocada en la salud mental y el bienestar integral.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Creemos que cada persona merece ser escuchada y apoyada. Nuestro nombre, "Azulanza", evoca la calma del azul y la esperanza de avanzar, simbolizando el refugio seguro que queremos ser para todos.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-4xl font-bold text-primary-blue mb-2">3+</h3>
                <p className="text-gray-600 font-medium">Años de experiencia</p>
              </div>
              <div className="bg-pink-50 p-6 rounded-xl">
                <h3 className="text-4xl font-bold text-primary-pink mb-2">500+</h3>
                <p className="text-gray-600 font-medium">Familias ayudadas</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-3xl shadow-lg border border-blue-100"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary-blue" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Misión</h2>
              <p className="text-gray-600 leading-relaxed">
                Brindar asistencia integral a personas en situación de vulnerabilidad, enfocándonos en la salud mental, la seguridad alimentaria y el desarrollo comunitario, promoviendo la dignidad y el empoderamiento personal.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-3xl shadow-lg border border-pink-100"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-primary-pink" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Visión</h2>
              <p className="text-gray-600 leading-relaxed">
                Ser reconocidos como un referente de solidaridad y transformación social, construyendo una red de apoyo sostenible donde la salud mental sea accesible para todos, sin importar su condición socioeconómica.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Empatía", desc: "Sentimos y comprendemos las necesidades de los demás." },
              { icon: CheckCircle, title: "Transparencia", desc: "Actuamos con honestidad en cada recurso gestionado." },
              { icon: Users, title: "Solidaridad", desc: "La unión hace la fuerza para transformar vidas." },
              { icon: Award, title: "Compromiso", desc: "Dedicación total a nuestra causa y beneficiarios." }
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-blue">
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-500">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
