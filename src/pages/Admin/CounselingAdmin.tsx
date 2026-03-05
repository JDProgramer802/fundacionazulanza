import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, Clock, Eye, FileText, Sheet, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminTable from '../../components/UI/AdminTable';
import { useExport } from '../../hooks/useExport';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

// Tipo para solicitudes de asesoría derivado de la BD
type CounselingRequest = Database['public']['Tables']['counseling_requests']['Row'];

const CounselingAdmin = () => {
  // Estado para solicitudes y carga
  const [requests, setRequests] = useState<CounselingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtro de estado ('all' por defecto)
  const [filter, setFilter] = useState('all'); 

  // Hook de exportación
  const { exportToPDF, exportToExcel } = useExport();

  // Cargar solicitudes cuando cambia el filtro
  useEffect(() => {
    fetchRequests();
  }, [filter]);

  // Obtener solicitudes desde Supabase
  const fetchRequests = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('counseling_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtro si no es 'all'
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast.error('Error al cargar solicitudes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar el estado de una solicitud (Pendiente -> Completado/Cancelado)
  const handleStatusChange = async (id: number, status: 'pending' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('counseling_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Estado actualizado a ${status === 'completed' ? 'Completado' : status}`);
      fetchRequests();
    } catch (error: any) {
      toast.error('Error al actualizar: ' + error.message);
    }
  };

  // Exportar lista actual a PDF
  const handleExportPDF = () => {
    exportToPDF(
      requests,
      [
        { header: 'ID', key: 'id' },
        { header: 'Nombre', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Teléfono', key: 'phone' },
        { header: 'Modalidad', key: 'modality' },
        { header: 'Fecha', key: 'date' },
        { header: 'Estado', key: 'status' }
      ],
      'Reporte de Asesorías',
      'asesorias_azulanza'
    );
  };

  // Exportar lista actual a Excel
  const handleExportExcel = () => {
    exportToExcel(
      requests,
      [
        { header: 'ID', key: 'id' },
        { header: 'Nombre', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Teléfono', key: 'phone' },
        { header: 'Modalidad', key: 'modality' },
        { header: 'Fecha', key: 'date' },
        { header: 'Hora', key: 'time' },
        { header: 'Mensaje', key: 'message' },
        { header: 'Estado', key: 'status' }
      ],
      'asesorias_azulanza'
    );
  };

  // Columnas de la tabla
  const columns = [
    {
      header: 'Solicitante',
      accessor: (row: CounselingRequest) => (
        <div>
          <p className="font-bold text-gray-800 dark:text-gray-200">{row.name}</p>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>{row.email}</p>
            <p>{row.phone}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Cita',
      accessor: (row: CounselingRequest) => (
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            {format(new Date(row.date), 'dd MMM yyyy', { locale: es })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {row.time} - {row.modality}
          </p>
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: (row: CounselingRequest) => {
        const colors = {
          'Pendiente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          'Completado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        const statusKey = row.status || 'Pendiente';
        // @ts-ignore
        const colorClass = colors[statusKey] || colors['Pendiente'];

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {statusKey}
          </span>
        );
      }
    },
    {
      header: 'Acciones',
      accessor: (row: CounselingRequest) => (
        <div className="flex gap-2">
          {row.status !== 'Completado' && (
            <button
              onClick={() => handleStatusChange(row.id, 'completed')}
              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
              title="Marcar como Completado"
            >
              <CheckCircle size={18} />
            </button>
          )}
          {row.status !== 'Cancelado' && (
            <button
              onClick={() => handleStatusChange(row.id, 'cancelled')}
              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              title="Cancelar Cita"
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asesoría Psicológica</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona las solicitudes de citas y acompañamiento</p>
        </div>
        
        {/* Botones de Exportación */}
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Sheet className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'Pendiente', 'Completado', 'Cancelado'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-blue text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {status === 'all' ? 'Todos' : status}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <AdminTable
          data={requests}
          columns={columns}
          loading={loading}
          emptyMessage="No hay solicitudes de asesoría registradas."
        />
      </div>
    </div>
  );
};

export default CounselingAdmin;
