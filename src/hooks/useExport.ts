import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCallback } from 'react';
import * as XLSX from 'xlsx';

// Definición de columna para la exportación
interface ExportColumn<T> {
  header: string; // Título de la columna
  key: keyof T;   // Clave del objeto de datos
}

// Hook para exportar datos a PDF y Excel
export const useExport = <T extends Record<string, any>>() => {

  // Exportar datos a PDF usando jspdf y jspdf-autotable
  const exportToPDF = useCallback((data: T[], columns: ExportColumn<T>[], title: string, filename: string) => {
    const doc = new jsPDF();

    // Configurar título y fecha
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);

    // Preparar filas de la tabla
    const tableColumn = columns.map(col => col.header);
    const tableRows = data.map(row => columns.map(col => {
        const val = row[col.key] as any;
        // Formatear fechas y booleanos
        if (val instanceof Date) return format(val, 'dd/MM/yyyy');
        if (typeof val === 'boolean') return val ? 'Sí' : 'No';
        return val || '-';
    }));

    // Generar tabla
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }, // Color azul corporativo
    });

    // Guardar archivo
    doc.save(`${filename}.pdf`);
  }, []);

  // Exportar datos a Excel (.xlsx) usando sheetjs (xlsx)
  const exportToExcel = useCallback((data: T[], columns: ExportColumn<T>[], filename: string) => {
    // Mapear datos al formato esperado por Excel
    const excelData = data.map(row => {
      const newRow: Record<string, any> = {};
      columns.forEach(col => {
        newRow[col.header] = row[col.key];
      });
      return newRow;
    });

    // Crear hoja de cálculo y libro
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Ajustar ancho de columnas (estimado)
    const maxWidth = 20;
    const wscols = columns.map(() => ({ wch: maxWidth }));
    worksheet['!cols'] = wscols;

    // Descargar archivo
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }, []);

  return { exportToPDF, exportToExcel };
};
