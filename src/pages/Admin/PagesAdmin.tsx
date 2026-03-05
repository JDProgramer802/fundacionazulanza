import { CheckCircle, FilePlus, Save, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminTable from '../../components/UI/AdminTable';
import { supabase } from '../../lib/supabase';

// Definición de la estructura de una página
type PageRow = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  status: string; // 'draft' | 'published'
};

const PagesAdmin = () => {
  // Estado local para lista de páginas, carga y formulario
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', status: 'draft' });

  // Cargar páginas desde Supabase ordenadas por fecha de actualización
  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('pages').select('*').order('updated_at', { ascending: false });
      if (error) throw error;
      setPages(data || []);
    } catch (e: any) {
      toast.error('Error al cargar páginas: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Crear una nueva página en la base de datos
  const handleCreate = async () => {
    try {
      if (!form.title || !form.slug) {
        toast.error('Título y slug son requeridos');
        return;
      }
      const { error } = await supabase.from('pages').insert([form]);
      if (error) throw error;
      toast.success('Página creada');
      setIsCreating(false);
      setForm({ title: '', slug: '', content: '', status: 'draft' });
      fetchPages();
    } catch (e: any) {
      toast.error('Error al crear página: ' + e.message);
    }
  };

  // Actualizar estado (publicado/borrador) de una página
  const handleStatus = async (id: number, status: 'draft' | 'published') => {
    try {
      const { error } = await supabase.from('pages').update({ status }).eq('id', id);
      if (error) throw error;
      toast.success('Estado actualizado');
      fetchPages();
    } catch (e: any) {
      toast.error('Error al actualizar: ' + e.message);
    }
  };

  // Eliminar una página
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('pages').delete().eq('id', id);
      if (error) throw error;
      toast.success('Página eliminada');
      fetchPages();
    } catch (e: any) {
      toast.error('Error al eliminar: ' + e.message);
    }
  };

  // Configuración de columnas para la tabla
  const columns = [
    {
      header: 'Título',
      accessor: (row: PageRow) => (
        <div>
          <p className="font-bold text-gray-800">{row.title}</p>
          <p className="text-xs text-gray-500">{row.slug}</p>
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: (row: PageRow) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
          {row.status === 'published' ? 'Publicada' : 'Borrador'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: (row: PageRow) => (
        <div className="flex gap-2">
            <button
                onClick={() => handleStatus(row.id, row.status === 'published' ? 'draft' : 'published')}
                className="text-blue-600 hover:text-blue-800"
                title={row.status === 'published' ? 'Despublicar' : 'Publicar'}
            >
                {row.status === 'published' ? <XCircle size={18} /> : <CheckCircle size={18} />}
            </button>
            <button
                onClick={() => handleDelete(row.id)}
                className="text-red-600 hover:text-red-800"
                title="Eliminar"
            >
                <XCircle size={18} />
            </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Páginas Dinámicas</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700"
        >
          <FilePlus size={18} />
          Nueva Página
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Crear Página</h2>
          <input
            type="text"
            placeholder="Título"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Slug (ej: quienes-somos)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <textarea
            placeholder="Contenido (HTML o Markdown básico)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save size={18} />
              Guardar
            </button>
          </div>
        </div>
      )}

      <AdminTable title="Lista de Páginas" data={pages} columns={columns} isLoading={loading} />
    </div>
  );
};

export default PagesAdmin;
