import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Modal from '../components/UI/Modal';
import Skeleton from '../components/UI/Skeleton';
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
    <div className="bg-white py-20 px-4">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-primary-blue mb-6"
          >
            Nuestra Galería de Impacto
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Revive los momentos más significativos de nuestras jornadas, eventos y entregas. Cada imagen cuenta una historia de esperanza y solidaridad.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${
                filter === cat
                  ? 'bg-primary-blue text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                <Skeleton className="w-full h-64 rounded-none" />
                <div className="p-6 space-y-3">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-full h-6" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedImage(img)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={img.image_url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-bold flex items-center gap-2">
                        Ver detalles <span className="text-xl">→</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-primary-pink font-bold uppercase text-xs tracking-widest">{img.category}</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-2 line-clamp-1">{img.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Modal */}
        {selectedImage && (
          <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="p-6 bg-white">
              <span className="text-primary-pink font-bold uppercase text-sm tracking-wider">{selectedImage.category}</span>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">{selectedImage.title}</h2>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Gallery;
