import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Eye, EyeOff, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Skeleton from '../../components/UI/Skeleton';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];

const HeroAdmin = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Form State
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update(formData)
          .eq('id', editingSlide.id);
        if (error) throw error;
        toast.success('Slide actualizado correctamente');
      } else {
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
      cta_text: slide.cta_text || 'Donar Ahora',
      cta_link: slide.cta_link || '/donaciones',
      active: slide.active || true,
      sort_order: slide.sort_order || 0
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión del Hero Slider</h1>
          <p className="text-gray-500">Administra las imágenes y textos de la pantalla principal.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nuevo Slide
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-64">
              <Skeleton className="w-full h-32" />
              <div className="p-4 space-y-2">
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
                !slide.active ? 'opacity-60 border-gray-200' : 'border-gray-100'
              }`}
            >
              <div className="relative h-48 bg-gray-100 group">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="p-2 bg-white rounded-full text-gray-800 hover:bg-primary-blue hover:text-white transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`p-1.5 rounded-full ${
                      slide.active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                    }`}
                    title={slide.active ? 'Ocultar' : 'Mostrar'}
                  >
                    {slide.active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 truncate">{slide.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{slide.subtitle}</p>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
                  <span className="bg-gray-100 px-2 py-1 rounded">Orden: {slide.sort_order}</span>
                  <a href={slide.cta_link} target="_blank" rel="noreferrer" className="text-primary-blue hover:underline">
                    {slide.cta_text} &rarr;
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                    <textarea
                      required
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none resize-none"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      />
                    </div>
                    {formData.image_url && (
                      <div className="mt-2 h-32 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texto del Botón</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                      value={formData.cta_text}
                      onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enlace del Botón</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                      value={formData.cta_link}
                      onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="active"
                      className="w-5 h-5 text-primary-blue rounded focus:ring-primary-blue"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Visible al público
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Save size={18} />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroAdmin;
