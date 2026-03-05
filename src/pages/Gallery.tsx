import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Filter, Heart, Image as ImageIcon, Maximize2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type GalleryItem = Database['public']['Tables']['gallery']['Row'];

const categories = ['Todos', 'Eventos', 'Jornadas', 'Entregas', 'Campañas'];

const Gallery = () => {
  const [filter, setFilter] = useState('Todos');
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = filter === 'Todos'
    ? images
    : images.filter(img => img.category === filter);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 fixed-bg"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/80 to-gray-50"></div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 text-sm font-medium mb-6">
              <Camera size={16} />
              <span className="tracking-wide">Capturando Momentos</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-xl">
              Galería de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">Impacto</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
              Cada fotografía cuenta una historia de esperanza, solidaridad y cambio. Explora nuestros momentos más memorables.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom pb-24 -mt-16 relative z-20">
        {/* Filter Bar */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/50 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-24 z-30 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide px-2">
            <Filter size={20} className="text-gray-400 min-w-[20px] mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  filter === cat
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden md:block px-6 text-sm text-gray-400 font-medium border-l border-gray-100">
            {filteredImages.length} momentos
          </div>
        </div>

        {/* Gallery Grid (Masonry) */}
        <div className="min-h-[50vh]">
            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={`skel-${i}`} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-80 animate-pulse">
                      <div className="w-full h-full bg-gray-200"></div>
                    </div>
                  ))}
               </div>
            ) : filteredImages.length > 0 ? (
              <ResponsiveMasonry
                  columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
              >
                  <Masonry gutter="24px">
                      {filteredImages.map((img, i) => (
                          <motion.div
                              layout
                              key={img.id}
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: i * 0.05 }}
                              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 cursor-zoom-in break-inside-avoid"
                              onClick={() => setSelectedImage(img)}
                          >
                              <div className="relative overflow-hidden">
                                  <img
                                      src={img.image_url}
                                      alt={img.title}
                                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                      loading="lazy"
                                  />

                                  {/* Overlay Glassmorphism */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold rounded-lg mb-3">
                                              {img.category}
                                          </span>
                                          <h3 className="text-white text-xl font-bold leading-tight mb-2 drop-shadow-md">{img.title}</h3>
                                          <div className="flex items-center gap-2 text-white/80 text-sm font-medium mt-2">
                                              <Maximize2 size={16} />
                                              <span>Ver detalle</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </motion.div>
                      ))}
                  </Masonry>
              </ResponsiveMasonry>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="text-gray-300" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">No hay imágenes en esta categoría</h3>
                <p className="text-gray-500 mt-2">Intenta seleccionar otra categoría.</p>
              </motion.div>
            )}
        </div>

        {/* Lightbox Modal Mejorado */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-6 right-6 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                }}
              >
                <X size={32} />
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative max-w-6xl w-full max-h-[90vh] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Imagen */}
                <div className="flex-1 bg-black/50 flex items-center justify-center relative group p-4 md:p-0">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain shadow-2xl rounded-lg"
                  />
                </div>

                {/* Sidebar de Detalles */}
                <div className="w-full md:w-[400px] bg-white dark:bg-gray-800 p-8 flex flex-col justify-between shrink-0">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {selectedImage.category}
                        </span>
                        <div className="flex gap-2">
                             <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                <Heart size={20} />
                             </button>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                      {selectedImage.title}
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                <Camera size={20} className="text-gray-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">Fotografía Original</h4>
                                <p className="text-sm text-gray-500">Alta resolución</p>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm border-t border-gray-100 dark:border-gray-700 pt-6">
                            "Una imagen vale más que mil palabras". Esta captura refleja el compromiso y la dedicación de nuestro equipo en campo.
                        </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                    >
                        Cerrar Vista
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;
