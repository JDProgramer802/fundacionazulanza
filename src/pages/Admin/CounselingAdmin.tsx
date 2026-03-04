import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, Clock, Eye, FileText, Sheet, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminTable from '../../components/UI/AdminTable';
import { useExport } from '../../hooks/useExport';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type CounselingRequest = Database['public']['Tables']['counseling_requests']['Row'];

const CounselingAdmin = () => {
  const [requests, setRequests] = useState<CounselingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const { exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('counseling_requests')
        .select('*')
        .order('created_at', { ascending: false });

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

  const columns = [
    {
      header: 'Solicitante',
      accessor: (row: CounselingRequest) => (
        <div>
          <p className="font-bold text-gray-800">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
          <p className="text-xs text-gray-400">{row.phone}</p>
        </div>
      )
    },
    {
      header: 'Modalidad & Fecha',
      accessor: (row: CounselingRequest) => (
        <div>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            row.modality === 'Virtual' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
          }`}>
            {row.modality}
          </span>
          <p className="mt-1 text-xs text-gray-600">
            {format(new Date(row.date), 'dd MMM yyyy', { locale: es })} - {row.time}
          </p>
        </div>
      )
    },
    {
      header: 'Mensaje',
      accessor: (row: CounselingRequest) => (
        <div className="max-w-xs truncate text-gray-500 italic" title={row.message || ''}>
          "{row.message || 'Sin mensaje'}"
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: (row: CounselingRequest) => (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
          row.status === 'completed' ? 'bg-green-100 text-green-600' :
          row.status === 'cancelled' ? 'bg-red-100 text-red-600' :
          'bg-yellow-100 text-yellow-600'
        }`}>
          {row.status === 'completed' ? <CheckCircle size={14} /> :
           row.status === 'cancelled' ? <XCircle size={14} /> :
           <Clock size={14} />}
          {row.status === 'completed' ? 'Atendido' :
           row.status === 'cancelled' ? 'Cancelado' :
           'Pendiente'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: (row: CounselingRequest) => (
        <div className="flex gap-2">
          {row.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange(row.id, 'completed')}
              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
              title="Marcar como Atendido"
            >
              <CheckCircle size={18} />
            </button>
          )}
          {row.status === 'pending' && (
            <button
              onClick={() => handleStatusChange(row.id, 'cancelled')}
              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              title="Cancelar Solicitud"
            >
              <XCircle size={18} />
            </button>
          )}
          <button
            className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Ver Detalles"
            onClick={() => toast.info('Detalles completos próximamente')}
          >
            <Eye size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Asesorías</h1>
          <p className="text-gray-500">Administra las solicitudes de apoyo psicológico.</p>
        </div>

        <div className="flex gap-2 mb-4 md:mb-0">
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
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === f ? 'bg-white shadow-sm text-primary-blue' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Atendidas'}
            </button>
          ))}
        </div>
      </div>

      <AdminTable
        title="Solicitudes Recientes"
        data={requests}
        columns={columns}
        isLoading={loading}
        onSearch={(q) => console.log('Buscar:', q)}
      />
    </div>
  );
};

export default CounselingAdmin;
