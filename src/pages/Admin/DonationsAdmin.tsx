import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DollarSign, FileText, Sheet, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminTable from '../../components/UI/AdminTable';
import { useExport } from '../../hooks/useExport';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type Donation = Database['public']['Tables']['donations']['Row'];

const DonationsAdmin = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const { exportToPDF, exportToExcel } = useExport();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);

      const total = (data || []).reduce((acc, curr) => acc + Number(curr.amount), 0);
      setTotalAmount(total);
    } catch (error: any) {
      toast.error('Error al cargar donaciones: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const columns = [
    {
      header: 'Donante',
      accessor: (row: Donation) => (
        <div>
          <p className="font-bold text-gray-800">{row.donor_name || 'Anónimo'}</p>
          <p className="text-xs text-gray-500">{row.payment_method || '-'}</p>
        </div>
      )
    },
    {
      header: 'Monto',
      accessor: (row: Donation) => (
        <span className="font-bold text-green-600">
          ${Number(row.amount).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Fecha',
      accessor: (row: Donation) => (
        <span className="text-gray-600 text-sm">
          {format(new Date(row.created_at), 'dd MMM yyyy, HH:mm', { locale: es })}
        </span>
      )
    },
    {
      header: 'Mensaje',
      accessor: (row: Donation) => (
        <div className="max-w-xs truncate text-gray-500 italic">
          {row.message ? `"${row.message}"` : '-'}
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: (row: Donation) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          row.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
        }`}>
          {row.status === 'completed' ? 'Completado' : 'Pendiente'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Historial de Donaciones</h1>
          <p className="text-gray-500">Monitorea los aportes recibidos.</p>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Recaudado</p>
            <p className="text-2xl font-bold text-gray-800">${totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Donaciones este mes</p>
            <p className="text-2xl font-bold text-gray-800">{donations.length}</p>
          </div>
        </div>
      </div>

      <AdminTable
        title="Transacciones Recientes"
        data={donations}
        columns={columns}
        isLoading={loading}
      />
    </div>
  );
};

export default DonationsAdmin;
