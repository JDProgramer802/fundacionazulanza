import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Filter, Image as ImageIcon, Link as LinkIcon, Loader2, Plus, Search, Sheet, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useExport } from '../../hooks/useExport';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

// Tipo derivado de la base de datos para elementos de la galería
type GalleryItem = Database['public']['Tables']['gallery']['Row'];

const GalleryAdmin = () => {
  // Estado para la lista de imágenes y carga
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtrado y búsqueda
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para el modal de agregar imagen
  const [isAdding, setIsAdding] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'link' | 'file'>('file');
  const [newItem, setNewItem] = useState({ title: '', category: 'Eventos', image_url: '' });

  // Estados para manejo de archivos
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook personalizado para exportar datos
  const { exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    fetchItems();
  }, []);

  // Obtiene la lista de imágenes desde Supabase ordenadas por fecha de creación descendente
  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Error al cargar la galería');
    } finally {
      setLoading(false);
    }
  };

  // Maneja el cambio de archivo en el input file y genera una URL de previsualización
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Procesa el formulario de agregar imagen.
  // Sube el archivo a Storage si es necesario y guarda el registro en la BD.
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = newItem.image_url;

    try {
      // Lógica de subida de archivo a Supabase Storage
      if (uploadMethod === 'file') {
        if (!selectedFile) throw new Error('Debes seleccionar un archivo');

        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`; // Guardar en raíz del bucket o subcarpeta

        // 1. Subir archivo
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // 2. Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      } else {
        // Validación para método 'link'
        if (!newItem.image_url) throw new Error('Debes proporcionar una URL de imagen');
      }

      // Insertar registro en base de datos
      const { data, error } = await supabase
        .from('gallery')
        .insert([{
          title: newItem.title,
          category: newItem.category,
          image_url: finalImageUrl
        }])
        .select();

      if (error) throw error;

      // Actualizar estado local
      if (data) setItems([data[0], ...items]);

      closeModal();
      toast.success('Imagen agregada correctamente');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al agregar la imagen';
      toast.error(message);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Elimina una imagen de la base de datos y del Storage (si aplica)
  const handleDeleteItem = async (id: number, imageUrl: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) return;

    try {
      // Intentar eliminar del storage si es una imagen alojada en Supabase
      if (imageUrl.includes('supabase.co') && imageUrl.includes('/gallery/')) {
        const urlParts = imageUrl.split('/gallery/');
        if (urlParts.length > 1) {
            const fileName = urlParts[1];
            await supabase.storage.from('gallery').remove([fileName]);
        }
      }

      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
      toast.success('Imagen eliminada');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Error al eliminar');
    }
  };

  // Restablece el estado del formulario y cierra el modal
  const closeModal = () => {
    setIsAdding(false);
    setNewItem({ title: '', category: 'Eventos', image_url: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadMethod('file');
  };

  // Filtrado de elementos para la vista
  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'Todos' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Datos preparados para exportación (sin mapear a estructura plana primero, pasamos items crudos)
  const columns = [
    { header: 'ID', key: 'id' as keyof GalleryItem },
    { header: 'Título', key: 'title' as keyof GalleryItem },
    { header: 'Categoría', key: 'category' as keyof GalleryItem },
    { header: 'Fecha Creación', key: 'created_at' as keyof GalleryItem },
    { header: 'URL', key: 'image_url' as keyof GalleryItem },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con título y botón de agregar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Galería</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona las imágenes de eventos y actividades</p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={() => exportToPDF(filteredItems, columns, 'Reporte de Galería', 'galeria_azulanza')}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                title="Exportar a PDF"
            >
                <FileText className="w-4 h-4" /> PDF
            </button>
            <button
                onClick={() => exportToExcel(filteredItems, columns, 'galeria_azulanza')}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                title="Exportar a Excel"
            >
                <Sheet className="w-4 h-4" /> Excel
            </button>
            <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
            <Plus className="w-5 h-5" />
            Nueva Imagen
            </button>
        </div>
      </div>

      {/* Barra de herramientas: Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-5 h-5 text-gray-400" />
          {['Todos', 'Eventos', 'Jornadas', 'Entregas', 'Campañas'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === cat
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-primary-blue dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Imágenes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error+Carga';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDeleteItem(item.id, item.image_url)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs font-medium text-white">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate" title={item.title}>{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No se encontraron imágenes</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Intenta cambiar los filtros o agrega una nueva imagen.</p>
        </div>
      )}

      {/* Modal para agregar imagen */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nueva Imagen</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              {/* Selector de tipo de subida */}
              <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-4">
                <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                        uploadMethod === 'file'
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-blue dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <Upload className="w-4 h-4" /> Subir Archivo
                </button>
                <button
                    type="button"
                    onClick={() => setUploadMethod('link')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                        uploadMethod === 'link'
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-blue dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <LinkIcon className="w-4 h-4" /> Usar Enlace
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Taller de Arte"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="Eventos">Eventos</option>
                  <option value="Jornadas">Jornadas</option>
                  <option value="Entregas">Entregas</option>
                  <option value="Campañas">Campañas</option>
                </select>
              </div>

              {uploadMethod === 'link' ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de la Imagen</label>
                    <input
                    type="url"
                    required
                    value={newItem.image_url}
                    onChange={(e) => {
                        setNewItem({ ...newItem, image_url: e.target.value });
                        setPreviewUrl(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    />
                </div>
              ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen</label>
                    <div
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-blue transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedFile ? selectedFile.name : 'Clic para seleccionar imagen'}
                        </p>
                    </div>
                </div>
              )}

              {/* Previsualización */}
              {previewUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img src={previewUrl} alt="Vista previa" className="w-full h-48 object-cover" />
                  </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Subiendo...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
