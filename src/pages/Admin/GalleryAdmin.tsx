import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Filter, Image as ImageIcon, Link as LinkIcon, Loader2, Plus, Search, Sheet, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useExport } from '../../hooks/useExport';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type GalleryItem = Database['public']['Tables']['gallery']['Row'];

const GalleryAdmin = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'link' | 'file'>('file');
  const [newItem, setNewItem] = useState({ title: '', category: 'Eventos', image_url: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    fetchItems();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = newItem.image_url;

    try {
      // Si el método es archivo, subir a Supabase Storage
      if (uploadMethod === 'file' && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      if (!finalImageUrl) {
        throw new Error('Debes proporcionar una imagen (archivo o link)');
      }

      const { data, error } = await supabase
        .from('gallery')
        .insert([{
          title: newItem.title,
          category: newItem.category,
          image_url: finalImageUrl
        }])
        .select();

      if (error) throw error;
      if (data) setItems([data[0], ...items]);

      closeModal();
      toast.success('Imagen agregada correctamente');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al agregar la imagen';
      console.error('Error adding gallery item:', error);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setIsAdding(false);
    setNewItem({ title: '', category: 'Eventos', image_url: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteItem = async (id: number, imageUrl: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;
    try {
      // Si la imagen está en nuestro storage, intentar eliminarla
      if (imageUrl.includes('storage.googleapis.com') || imageUrl.includes('supabase.co')) {
        const path = imageUrl.split('/').pop();
        if (path) {
          await supabase.storage.from('gallery').remove([`public/${path}`]);
        }
      }

      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
      toast.success('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('Error al eliminar la imagen');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'Todos' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportPDF = () => {
    exportToPDF(
      items,
      [
        { header: 'ID', key: 'id' },
        { header: 'Título', key: 'title' },
        { header: 'Categoría', key: 'category' },
        { header: 'Fecha', key: 'created_at' },
        { header: 'URL', key: 'image_url' }
      ],
      'Reporte de Galería',
      'galeria_azulanza'
    );
  };

  const handleExportExcel = () => {
    exportToExcel(
      items,
      [
        { header: 'ID', key: 'id' },
        { header: 'Título', key: 'title' },
        { header: 'Categoría', key: 'category' },
        { header: 'Fecha', key: 'created_at' },
        { header: 'URL', key: 'image_url' }
      ],
      'galeria_azulanza'
    );
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary-blue" />
        <p>Cargando galería...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Galería</h1>
          <p className="text-gray-500">Administra las imágenes mostradas en el sitio.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FileText size={18} />
            PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 border border-green-100 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Sheet size={18} />
            Excel
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            Nueva Imagen
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por título..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none appearance-none bg-white w-full text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Todos">Todas las categorías</option>
            <option value="Eventos">Eventos</option>
            <option value="Jornadas">Jornadas</option>
            <option value="Entregas">Entregas</option>
            <option value="Campañas">Campañas</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-48">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteItem(item.id, item.image_url)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs font-bold text-primary-pink uppercase tracking-wider">{item.category}</span>
              <h3 className="font-bold text-gray-800 mt-1 truncate">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
          No se encontraron imágenes.
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Agregar Nueva Imagen</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                    value={newItem.title}
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                    placeholder="Ej. Taller de Arte Terapia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none bg-white"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option value="Eventos">Eventos</option>
                    <option value="Jornadas">Jornadas</option>
                    <option value="Entregas">Entregas</option>
                    <option value="Campañas">Campañas</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Método de subida</label>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${uploadMethod === 'file' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Upload size={16} /> Subir archivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('link')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${uploadMethod === 'link' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <LinkIcon size={16} /> Usar link
                    </button>
                  </div>
                </div>

                {uploadMethod === 'file' ? (
                  <div className="space-y-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${previewUrl ? 'border-primary-blue bg-blue-50' : 'border-gray-300 hover:border-primary-blue hover:bg-gray-50'}`}
                    >
                      {previewUrl ? (
                        <div className="relative w-full aspect-video">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-blue-100 text-primary-blue rounded-full flex items-center justify-center">
                            <ImageIcon size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-700">Haz clic para subir</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG o JPEG (Máx. 5MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                    <input
                      type="url"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                      value={newItem.image_url}
                      onChange={e => setNewItem({...newItem, image_url: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={isUploading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    disabled={isUploading || (uploadMethod === 'file' && !selectedFile) || (uploadMethod === 'link' && !newItem.image_url)}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Subiendo...
                      </>
                    ) : 'Guardar Imagen'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryAdmin;
