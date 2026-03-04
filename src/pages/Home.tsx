import { motion } from 'framer-motion';
import { Activity, ArrowRight, ChevronRight, Heart, Quote, Smile, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Note: effect-fade styles might be included in main css or not needed if using modules correctly
// If specific file is missing, we can try importing from 'swiper/modules/effect-fade/effect-fade.min.css' or similar
// For now, let's comment it out if it causes build errors, as basic fade often works with base css
// import 'swiper/css/effect-fade';

type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];

const Home = () => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const fetchHeroSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setHeroSlides(data);
      } else {
        // Fallback slides if no data
        setHeroSlides([
          {
            id: 1,
            created_at: '',
            title: "Construyendo Esperanza",
            subtitle: "Transformando vidas a través de la solidaridad y el apoyo mutuo.",
            image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            cta_text: "Donar Ahora",
            cta_link: "/donaciones",
            active: true,
            sort_order: 1
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    }
  };

  const testimonials = [
    {
      name: "Laura R.",
      role: "Beneficiaria",
      text: "La asesoría psicológica de la fundación cambió mi vida. Me brindaron las herramientas para superar un momento muy difícil.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Andrés M.",
      role: "Voluntario",
      text: "Ser parte de Azulanza es una experiencia enriquecedora. Ver la sonrisa de los niños en cada jornada no tiene precio.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Claudia P.",
      role: "Donante",
      text: "Confío plenamente en la labor de la fundación. Su transparencia y compromiso con la comunidad son admirables.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      {/* Hero Section with Slider */}
      <section className="relative h-screen">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect={'fade'}
          speed={1000}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={true}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index} className="relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image_url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-pink-900/60 mix-blend-multiply" />
              <div className="absolute inset-0 bg-black/20" />

              <div className="relative z-10 container-custom h-full flex flex-col justify-center items-start text-white px-4 md:px-0">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-10 text-gray-100 font-light drop-shadow-md max-w-2xl">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={slide.cta_link || '/donaciones'}
                      className="group bg-primary-pink hover:bg-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-pink-500/50 flex items-center justify-center gap-2"
                    >
                      <Heart className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                      {slide.cta_text || 'Donar Ahora'}
                    </Link>
                    <Link
                      to="/asesoria"
                      className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Solicitar Ayuda
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 transform translate-x-20 -z-10" />

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-primary-blue font-bold uppercase tracking-wider text-sm bg-blue-50 px-4 py-2 rounded-full mb-4 inline-block">
              Nuestros Resultados
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-2">
              Impacto Real en la Comunidad
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Cada número representa una historia, una vida transformada y una esperanza renovada gracias a tu generosidad.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Users, count: 500, suffix: "+", label: "Familias Beneficiadas", color: "bg-blue-100 text-blue-600", border: "border-blue-200" },
              { icon: Activity, count: 1200, suffix: "+", label: "Sesiones de Asesoría", color: "bg-pink-100 text-pink-600", border: "border-pink-200" },
              { icon: Smile, count: 50, suffix: "+", label: "Jornadas de Salud", color: "bg-amber-100 text-amber-600", border: "border-amber-200" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px -5px rgba(0,0,0,0.1)" }}
                className={`p-10 rounded-3xl bg-white border ${stat.border} shadow-lg transition-all duration-300 text-center group`}
              >
                <div className={`inline-flex p-5 rounded-2xl mb-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-5xl font-bold text-gray-800 mb-2 tracking-tight">
                  <CountUp end={stat.count} duration={2.5} enableScrollSpy scrollSpyOnce />
                  <span className="text-3xl text-gray-400 ml-1">{stat.suffix}</span>
                </h3>
                <p className="text-gray-500 font-medium text-lg mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brief About Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-pink/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-blue/20 rounded-full blur-3xl"></div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Voluntarios trabajando"
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                <p className="text-white font-bold text-xl">"La solidaridad es el idioma que todos entendemos"</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-pink font-bold uppercase tracking-wider text-sm mb-2 block">
              Nuestra Esencia
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Más que una fundación, <br /> somos una <span className="text-primary-blue underline decoration-wavy decoration-primary-pink/50">familia</span>
            </h2>

            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Fundación Azulanza nació con el propósito de brindar una mano amiga a quienes atraviesan momentos difíciles. Creemos firmemente en el poder de la solidaridad y en la importancia de la salud mental como pilar fundamental para el bienestar.
              </p>
              <p>
                Nuestro equipo de profesionales y voluntarios trabaja incansablemente para llevar esperanza, recursos y atención especializada a las comunidades más vulnerables.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/nosotros"
                className="group flex items-center gap-3 text-primary-blue font-bold text-lg px-6 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Conoce nuestra historia
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/voluntarios"
                className="flex items-center gap-3 text-gray-600 font-bold text-lg px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Ser Voluntario
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary-blue font-bold uppercase tracking-wider text-sm bg-blue-50 px-4 py-2 rounded-full mb-4 inline-block">
              Testimonios
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-2">Lo que dicen de nosotros</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Historias reales de personas que han sido impactadas por nuestra labor.
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-16 px-4"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className="h-full">
                <div className="bg-gray-50 p-8 rounded-3xl h-full flex flex-col hover:shadow-lg transition-shadow duration-300 relative">
                  <Quote className="w-10 h-10 text-primary-pink/20 absolute top-6 right-6" />

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{testimonial.name}</h4>
                      <p className="text-primary-blue text-sm font-medium">{testimonial.role}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 italic leading-relaxed flex-grow">
                    "{testimonial.text}"
                  </p>

                  <div className="flex gap-1 mt-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-pink/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Listo para hacer la diferencia?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Tu ayuda, por pequeña que parezca, puede transformar la vida de alguien hoy mismo. Únete a nuestra causa.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/donaciones"
                className="bg-white text-primary-blue px-10 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Donar Ahora
              </Link>
              <Link
                to="/contacto"
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-white/10 transition-all"
              >
                Contáctanos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
