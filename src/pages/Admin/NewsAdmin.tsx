import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, FileText, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type NewsItem = Database['public']['Tables']['news']['Row'];

const NewsAdmin = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todos'); // Todos, Activos, Inactivos

  // Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<NewsItem>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    image_url: '',
    active: true,
    author: 'Fundación Azulanza'
  });

  // Manejo de imagen
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error: any) {
      toast.error('Error al cargar noticias: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: NewsItem) => {
    if (item) {
      setIsEditing(true);
      setCurrentItem(item);
      setPreviewUrl(item.image_url);
    } else {
      setIsEditing(false);
      setCurrentItem({
        title: '',
        slug: '',
        summary: '',
        content: '',
        image_url: '',
        active: true,
        author: 'Fundación Azulanza'
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
      .trim()
      .replace(/\s+/g, '-'); // Reemplazar espacios por guiones
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = currentItem.image_url;

      // 1. Subir imagen si se seleccionó una nueva
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `news_${Date.now()}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // 2. Generar slug si no existe o si cambió el título (opcional, aquí forzamos regeneración si es nuevo)
      const slug = currentItem.slug || generateSlug(currentItem.title || 'noticia');

      const newsData = {
        ...currentItem,
        image_url: imageUrl,
        slug: slug,
        updated_at: new Date().toISOString() // Nota: updated_at no está en la tabla por defecto, pero supabase lo maneja si se configura
      };
      // Eliminar campos que no deben enviarse si son undefined o no corresponden a la tabla
      // En este caso, usamos Partial<NewsItem>, así que deberíamos estar bien.

      if (isEditing && currentItem.id) {
        const { error } = await supabase
          .from('news')
          .update({
            title: newsData.title,
            slug: newsData.slug,
            summary: newsData.summary,
            content: newsData.content,
            image_url: newsData.image_url,
            active: newsData.active,
            author: newsData.author
          })
          .eq('id', currentItem.id);
        if (error) throw error;
        toast.success('Noticia actualizada');
      } else {
        const { error } = await supabase
          .from('news')
          .insert([{
            title: newsData.title!,
            slug: slug,
            summary: newsData.summary,
            content: newsData.content!,
            image_url: newsData.image_url,
            active: newsData.active,
            author: newsData.author
          }]);
        if (error) throw error;
        toast.success('Noticia creada');
      }

      setIsModalOpen(false);
      fetchNews();
    } catch (error: any) {
      toast.error('Error al guardar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta noticia?')) return;
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      toast.success('Noticia eliminada');
      fetchNews();
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    }
  };

  const toggleStatus = async (item: NewsItem) => {
    try {
      const { error } = await supabase
        .from('news')
        .update({ active: !item.active })
        .eq('id', item.id);
      if (error) throw error;
      fetchNews();
      toast.success(`Noticia ${!item.active ? 'activada' : 'desactivada'}`);
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    }
  };

  // Filtrado
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' ||
                          (filter === 'Activos' && item.active) ||
                          (filter === 'Inactivos' && !item.active);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Noticias</h1>
          <p className="text-gray-500 dark:text-gray-400">Publica y administra las novedades de la fundación.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            <Plus size={20} />
            Nueva Noticia
          </button>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-blue/20 outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {['Todos', 'Activos', 'Inactivos'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Noticias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredNews.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image_url || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.active ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-gray-400 mb-2">
                  {new Date(item.published_at!).toLocaleDateString()}
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                  {item.summary || item.content.substring(0, 100) + '...'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => toggleStatus(item)}
                    className={`text-sm font-medium ${item.active ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}`}
                  >
                    {item.active ? 'Ocultar' : 'Publicar'}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredNews.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay noticias</h3>
          <p className="text-gray-500 dark:text-gray-400">Empieza creando una nueva publicación.</p>
        </div>
      )}

      {/* Modal de Edición/Creación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {isEditing ? 'Editar Noticia' : 'Nueva Noticia'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Imagen */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen Principal</label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
                  ) : (
                    <div className="py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Clic para subir imagen</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>

              {/* Título y Slug */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={currentItem.title}
                    onChange={(e) => {
                      setCurrentItem({ ...currentItem, title: e.target.value });
                      if (!isEditing) {
                        setCurrentItem(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
                    <input
                      type="text"
                      value={currentItem.slug}
                      onChange={(e) => setCurrentItem({ ...currentItem, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 font-mono text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Resumen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resumen Corto</label>
                <textarea
                  rows={2}
                  value={currentItem.summary || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Breve descripción para la tarjeta..."
                />
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido Completo</label>
                <textarea
                  required
                  rows={8}
                  value={currentItem.content}
                  onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Escribe aquí el contenido de la noticia..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentItem.active}
                    onChange={(e) => setCurrentItem({ ...currentItem, active: e.target.checked })}
                    className="w-4 h-4 text-primary-blue rounded focus:ring-primary-blue"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Publicar inmediatamente</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 bg-primary-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2"
                >
                  {uploading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {isEditing ? 'Guardar Cambios' : 'Crear Noticia'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NewsAdmin;
