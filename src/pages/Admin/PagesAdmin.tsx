import { CheckCircle, FilePlus, Save, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminTable from '../../components/UI/AdminTable';
import { supabase } from '../../lib/supabase';

type PageRow = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  status: string;
};

const PagesAdmin = () => {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', status: 'draft' });

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
          {row.status !== 'published' ? (
            <button onClick={() => handleStatus(row.id, 'published')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
              <CheckCircle size={18} />
            </button>
          ) : (
            <button onClick={() => handleStatus(row.id, 'draft')} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100">
              <XCircle size={18} />
            </button>
          )}
          <button onClick={() => handleDelete(row.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
            <XCircle size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Páginas</h1>
          <p className="text-gray-500">Gestiona el contenido del sitio.</p>
        </div>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700">
          <FilePlus size={18} />
          Nueva Página
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            <option value="draft">Borrador</option>
            <option value="published">Publicada</option>
          </select>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} placeholder="Contenido" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Save size={18} />
              Guardar
            </button>
            <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
          </div>
        </div>
      )}

      <AdminTable title="Listado de Páginas" data={pages} columns={columns} isLoading={loading} />
    </div>
  );
};

export default PagesAdmin;
