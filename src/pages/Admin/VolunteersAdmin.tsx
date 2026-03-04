import { CheckCircle, Mail, Phone, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminTable from '../../components/UI/AdminTable';
import { useExport } from '../../hooks/useExport';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type Volunteer = Database['public']['Tables']['volunteers']['Row'];

const VolunteersAdmin = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const { exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (error: any) {
      toast.error('Error al cargar voluntarios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Voluntario ${status === 'approved' ? 'aprobado' : 'rechazado'}`);
      fetchVolunteers();
    } catch (error: any) {
      toast.error('Error al actualizar: ' + error.message);
    }
  };

  const handleExportPDF = () => {
    exportToPDF(
      volunteers,
      [
        { header: 'ID', key: 'id' },
        { header: 'Nombre', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Teléfono', key: 'phone' },
        { header: 'Disponibilidad', key: 'availability' },
        { header: 'Habilidades', key: 'skills' },
        { header: 'Estado', key: 'status' }
      ],
      'Reporte de Voluntarios',
      'voluntarios_azulanza'
    );
  };

  const handleExportExcel = () => {
    exportToExcel(
      volunteers,
      [
        { header: 'ID', key: 'id' },
        { header: 'Nombre', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Teléfono', key: 'phone' },
        { header: 'Disponibilidad', key: 'availability' },
        { header: 'Habilidades', key: 'skills' },
        { header: 'Motivación', key: 'motivation' },
        { header: 'Estado', key: 'status' }
      ],
      'voluntarios_azulanza'
    );
  };

  const columns = [
    {
      header: 'Nombre',
      accessor: (row: Volunteer) => (
        <div>
          <p className="font-bold text-gray-800">{row.name}</p>
          <div className="flex gap-2 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1"><Mail size={12} /> {row.email}</span>
            <span className="flex items-center gap-1"><Phone size={12} /> {row.phone}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Disponibilidad & Habilidades',
      accessor: (row: Volunteer) => (
        <div>
          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
            {row.availability}
          </span>
          <p className="mt-1 text-xs text-gray-600 truncate max-w-[150px]" title={row.skills}>
            {row.skills}
          </p>
        </div>
      )
    },
    {
      header: 'Motivación',
      accessor: (row: Volunteer) => (
        <div className="text-xs text-gray-500 italic truncate max-w-[200px]" title={row.motivation}>
          "{row.motivation}"
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: (row: Volunteer) => (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
          row.status === 'approved' ? 'bg-green-100 text-green-600' :
          row.status === 'rejected' ? 'bg-red-100 text-red-600' :
          'bg-yellow-100 text-yellow-600'
        }`}>
          {row.status === 'approved' ? 'Aprobado' :
           row.status === 'rejected' ? 'Rechazado' :
           'Pendiente'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: (row: Volunteer) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange(row.id, 'approved')}
                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                title="Aprobar"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => handleStatusChange(row.id, 'rejected')}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Rechazar"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
          <a
            href={`mailto:${row.email}`}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            title="Enviar Correo"
          >
            <Mail size={18} />
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Voluntarios</h1>
          <p className="text-gray-500">Revisa y aprueba las solicitudes de voluntariado.</p>
        </div>
      </div>

      <AdminTable
        title="Aspirantes Registrados"
        data={volunteers}
        columns={columns}
        isLoading={loading}
      />
    </div>
  );
};

export default VolunteersAdmin;
