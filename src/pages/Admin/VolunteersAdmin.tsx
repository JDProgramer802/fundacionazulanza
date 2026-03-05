import { CheckCircle, Mail, Phone, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminTable from '../../components/UI/AdminTable';
import { useExport } from '../../hooks/useExport';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

// Tipo de dato para voluntarios derivado de la base de datos
type Volunteer = Database['public']['Tables']['volunteers']['Row'];

const VolunteersAdmin = () => {
  // Estado para la lista de voluntarios y el indicador de carga
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  // Hook personalizado para exportar datos
  const { exportToPDF, exportToExcel } = useExport();

  // Cargar voluntarios al montar el componente
  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Obtener lista de voluntarios desde Supabase
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

  // Actualizar el estado de aprobación de un voluntario
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

  // Exportar lista de voluntarios a PDF
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

  // Exportar lista de voluntarios a Excel
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

  // Configuración de columnas para la tabla
  const columns = [
    {
      header: 'Nombre',
      accessor: (row: Volunteer) => (
        <div>
          <p className="font-bold text-gray-800 dark:text-gray-200">{row.name}</p>
          <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
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
            <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Disp:</span> {row.availability || 'N/A'}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Habil:</span> {row.skills || 'N/A'}
            </p>
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: (row: Volunteer) => {
        const colors = {
          'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          'approved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        const statusKey = row.status || 'pending';
        // @ts-ignore
        const colorClass = colors[statusKey] || colors['pending'];

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {statusKey === 'pending' ? 'Pendiente' : statusKey === 'approved' ? 'Aprobado' : 'Rechazado'}
          </span>
        );
      }
    },
    {
      header: 'Acciones',
      accessor: (row: Volunteer) => (
        <div className="flex gap-2">
          {row.status !== 'approved' && (
            <button
              onClick={() => handleStatusChange(row.id, 'approved')}
              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
              title="Aprobar"
            >
              <CheckCircle size={18} />
            </button>
          )}
          {row.status !== 'rejected' && (
            <button
              onClick={() => handleStatusChange(row.id, 'rejected')}
              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              title="Rechazar"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Voluntarios</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona las solicitudes de voluntariado</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <CheckCircle className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Phone className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <AdminTable
          data={volunteers}
          columns={columns}
          loading={loading}
          emptyMessage="No hay voluntarios registrados."
        />
      </div>
    </div>
  );
};

export default VolunteersAdmin;
