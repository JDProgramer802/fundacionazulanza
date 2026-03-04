import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  title: string;
  actionButton?: ReactNode;
}

const AdminTable = <T extends { id: number | string }>({
  data,
  columns,
  onSearch,
  isLoading,
  title,
  actionButton
}: AdminTableProps<T>) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{data.length} registros encontrados</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {onSearch && (
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none w-full sm:w-64"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
          {actionButton}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col, idx) => (
                <th key={idx} className={`p-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className={`p-4 text-sm text-gray-600 ${col.className || ''}`}>
                      {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
        <span className="text-xs text-gray-500">Mostrando {data.length} resultados</span>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;
