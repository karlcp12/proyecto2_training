import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Material {
  codigo: number;
  nombre: string;
  cantidad: number;
  tipo: string;
}

export const generateMaterialsPDF = (materials: Material[], title: string = 'Reporte de Inventario') => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();


  doc.setFontSize(20);
  doc.setTextColor(40, 167, 69);
  doc.text('SENA - Centro Agroindustrial', 105, 20, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(title.toUpperCase(), 105, 30, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Fecha de generación: ${date}`, 105, 38, { align: 'center' });
  doc.line(20, 42, 190, 42);


  const tableRows = materials.map(m => [
    m.codigo.toString(),
    m.nombre,
    m.tipo,
    m.cantidad.toString()
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['CÓDIGO', 'NOMBRE DEL MATERIAL', 'CATEGORÍA', 'STOCK']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [40, 167, 69], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    alternateRowStyles: { fillColor: [240, 248, 240] }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: 'center' });
    doc.text('Sistema de Gestión y Trazabilidad de Materiales - SENA', 105, 290, { align: 'center' });
  }

  doc.save(`reporte_materiales_${Date.now()}.pdf`);
};

export const generateSingleMaterialPDF = (material: Material) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();


  doc.setFillColor(40, 167, 69);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setFontSize(24);
  doc.setTextColor(255);
  doc.text('FICHA DE MATERIAL', 105, 25, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Generado el: ${date}`, 190, 35, { align: 'right' });

  // Content Box
  doc.setDrawColor(40, 167, 69);
  doc.setLineWidth(1);
  doc.rect(20, 50, 170, 80);

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalles del Artículo', 30, 65);
  doc.line(30, 68, 80, 68);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Código:`, 35, 80);
  doc.setFont('helvetica', 'bold');
  doc.text(`${material.codigo}`, 80, 80);

  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre:`, 35, 90);
  doc.setFont('helvetica', 'bold');
  doc.text(`${material.nombre}`, 80, 90);

  doc.setFont('helvetica', 'normal');
  doc.text(`Categoría:`, 35, 100);
  doc.setFont('helvetica', 'bold');
  doc.text(`${material.tipo}`, 80, 100);

  doc.setFont('helvetica', 'normal');
  doc.text(`Cantidad en Stock:`, 35, 110);
  doc.setFont('helvetica', 'bold');
  if (material.cantidad < 5) doc.setTextColor(220, 53, 69);
  else doc.setTextColor(40, 167, 69);
  doc.text(`${material.cantidad} unidades`, 80, 110);


  doc.setTextColor(0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Historial Reciente', 20, 150);
  doc.line(20, 153, 60, 153);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('* Este documento es una representación oficial del inventario en bodega.', 105, 270, { align: 'center' });

  const fileName = (material.nombre || 'material').replace(/\s+/g, '_');
  doc.save(`ficha_${fileName}.pdf`);
};
