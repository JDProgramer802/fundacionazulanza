import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Eye, EyeOff, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Skeleton from '../../components/UI/Skeleton';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

// Tipo HeroSlide derivado de la base de datos
type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];

const HeroAdmin = () => {
  // Estado para slides y gestión de UI
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    cta_text: 'Donar Ahora',
    cta_link: '/donaciones',
    active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  // Obtener slides ordenados
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error: any) {
      toast.error('Error al cargar slides: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar envío del formulario (Crear o Actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        // Actualizar existente
        const { error } = await supabase
          .from('hero_slides')
          .update(formData)
          .eq('id', editingSlide.id);
        if (error) throw error;
        toast.success('Slide actualizado correctamente');
      } else {
        // Crear nuevo (asignar orden al final)
        const { error } = await supabase
          .from('hero_slides')
          .insert([{ ...formData, sort_order: slides.length + 1 }]);
        if (error) throw error;
        toast.success('Slide creado correctamente');
      }
      setIsModalOpen(false);
      fetchSlides();
      resetForm();
    } catch (error: any) {
      toast.error('Error al guardar: ' + error.message);
    }
  };

  // Eliminar slide
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este slide?')) return;
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
      toast.success('Slide eliminado');
      fetchSlides();
    } catch (error: any) {
      toast.error('Error al eliminar: ' + error.message);
    }
  };

  // Alternar estado activo/inactivo
  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ active: !slide.active })
        .eq('id', slide.id);
      if (error) throw error;
      fetchSlides();
    } catch (error: any) {
      toast.error('Error al actualizar estado: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      cta_text: 'Donar Ahora',
      cta_link: '/donaciones',
      active: true,
      sort_order: 0
    });
    setEditingSlide(null);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.image_url,
      cta_text: slide.cta_text || '',
      cta_link: slide.cta_link || '',
      active: slide.active || true,
      sort_order: slide.sort_order || 0
    });
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hero Slider</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona las imágenes principales del inicio</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> Nuevo Slide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {slides.map((slide) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group"
            >
              <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEditModal(slide)} className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(slide.id)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`p-1.5 rounded-full ${slide.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                    title={slide.active ? 'Activo' : 'Inactivo'}
                  >
                    {slide.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 dark:text-white truncate">{slide.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{slide.subtitle}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                  <span className="font-semibold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    CTA: {slide.cta_text}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal de Edición/Creación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtítulo</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto Botón</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enlace Botón</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={formData.cta_link}
                    onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeroAdmin;
