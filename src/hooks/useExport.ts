import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCallback } from 'react';
import * as XLSX from 'xlsx';

interface ExportColumn<T> {
  header: string;
  key: keyof T;
}

export const useExport = <T extends Record<string, any>>() => {

  const exportToPDF = useCallback((data: T[], columns: ExportColumn<T>[], title: string, filename: string) => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);

    // Tabla
    const tableColumn = columns.map(col => col.header);
    const tableRows = data.map(row => columns.map(col => {
        const val = row[col.key] as any;
        // Formatear valores especiales si es necesario
        if (val instanceof Date) return format(val, 'dd/MM/yyyy');
        if (typeof val === 'boolean') return val ? 'Sí' : 'No';
        return val || '-';
    }));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }, // Azul corporativo
    });

    doc.save(`${filename}.pdf`);
  }, []);

  const exportToExcel = useCallback((data: T[], columns: ExportColumn<T>[], filename: string) => {
    // Mapear datos a formato Excel
    const excelData = data.map(row => {
      const newRow: Record<string, any> = {};
      columns.forEach(col => {
        newRow[col.header] = row[col.key];
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Ajustar ancho de columnas automáticamente
    const maxWidth = 20;
    const wscols = columns.map(() => ({ wch: maxWidth }));
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }, []);

  return { exportToPDF, exportToExcel };
};
