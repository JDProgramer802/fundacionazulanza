import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DollarSign, FileText, Sheet, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminTable from '../../components/UI/AdminTable';
import { useExport } from '../../hooks/useExport';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

// Tipo Donation derivado de la base de datos
type Donation = Database['public']['Tables']['donations']['Row'];

const DonationsAdmin = () => {
  // Estado para las donaciones, carga y total recaudado
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Hook de exportación
  const { exportToPDF, exportToExcel } = useExport();

  // Cargar donaciones al montar el componente
  useEffect(() => {
    fetchDonations();
  }, []);

  // Obtener donaciones desde Supabase
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);

      // Calcular total acumulado
      const total = (data || []).reduce((acc, curr) => acc + Number(curr.amount), 0);
      setTotalAmount(total);
    } catch (error: any) {
      toast.error('Error al cargar donaciones: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejador para exportar a PDF
  const handleExportPDF = () => {
    exportToPDF(
      donations,
      [
        { header: 'ID', key: 'id' },
        { header: 'Donante', key: 'donor_name' },
        { header: 'Monto', key: 'amount' },
        { header: 'Fecha', key: 'created_at' },
        { header: 'Estado', key: 'status' }
      ],
      'Reporte de Donaciones',
      'donaciones_azulanza'
    );
  };

  // Manejador para exportar a Excel
  const handleExportExcel = () => {
    exportToExcel(
      donations,
      [
        { header: 'ID', key: 'id' },
        { header: 'Donante', key: 'donor_name' },
        { header: 'Monto', key: 'amount' },
        { header: 'Fecha', key: 'created_at' },
        { header: 'Mensaje', key: 'message' },
        { header: 'Estado', key: 'status' }
      ],
      'donaciones_azulanza'
    );
  };

  // Configuración de columnas para la tabla administrativa
  const columns = [
    {
      header: 'Donante',
      accessor: (row: Donation) => (
        <div>
          <p className="font-bold text-gray-800 dark:text-gray-200">{row.donor_name || 'Anónimo'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{row.payment_method || '-'}</p>
        </div>
      )
    },
    {
      header: 'Monto',
      accessor: (row: Donation) => (
        <span className="font-bold text-green-600 dark:text-green-400">
          ${Number(row.amount).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Fecha',
      accessor: (row: Donation) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {format(new Date(row.created_at), 'dd MMM yyyy, HH:mm', { locale: es })}
        </span>
      )
    },
    {
      header: 'Mensaje',
      accessor: (row: Donation) => (
        <p className="text-sm text-gray-600 dark:text-gray-300 italic truncate max-w-xs">
          "{row.message || 'Sin mensaje'}"
        </p>
      )
    },
    {
      header: 'Estado',
      accessor: (row: Donation) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.status === 'Completado' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Donaciones</h1>
          <p className="text-gray-500 dark:text-gray-400">Historial de donaciones recibidas</p>
        </div>
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

      {/* Tarjeta de Resumen Total */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
          <DollarSign className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Recaudado</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalAmount.toLocaleString()}
          </h2>
        </div>
        <div className="ml-auto text-green-500 flex items-center gap-1 text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>Histórico</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <AdminTable
          data={donations}
          columns={columns}
          loading={loading}
          emptyMessage="No hay donaciones registradas aún."
        />
      </div>
    </div>
  );
};

export default DonationsAdmin;
