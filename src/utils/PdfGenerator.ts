import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Material {
  codigo: number;
  nombre: string;
  cantidad: number;
  tipo: string;
}

const getBase64ImageFromUrl = async (url: string): Promise<string> => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
};

export const generateMaterialsPDF = async (materials: Material[], title: string = 'REPORTE DE INVENTARIO') => {
  const doc = new jsPDF();
  const date = new Date().toLocaleString('es-CO');
  
  try {
    const logimatLogo = await getBase64ImageFromUrl('/LogoLogitmat_sin_fondo.png');
    const senaLogo = await getBase64ImageFromUrl('/logo-sena-negro.png');

    // 1. Watermark (Smaller and more subtle)
    const addWatermark = (d: jsPDF) => {
      const pageWidth = d.internal.pageSize.getWidth();
      const pageHeight = d.internal.pageSize.getHeight();
      d.saveGraphicsState();
      d.setGState(new (d as any).GState({ opacity: 0.04 }));
      // 80x80 centered
      d.addImage(logimatLogo, 'PNG', pageWidth / 2 - 40, pageHeight / 2 - 40, 80, 80);
      d.restoreGraphicsState();
    };

    // 2. Header (Refined)
    const senaSize = 12;
    doc.addImage(senaLogo, 'PNG', 180, 10, senaSize, senaSize);
    
    // Small logo in header
    doc.addImage(logimatLogo, 'PNG', 20, 12, 12, 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(57, 169, 0);
    doc.text('LOGIMAT', 35, 23);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('GESTIÓN INTEGRAL DE MATERIALES - SENA', 35, 28);

    doc.setDrawColor(57, 169, 0);
    doc.setLineWidth(1);
    doc.line(20, 35, 50, 35);

    // 3. Report Info
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 20, 50);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`Emisión: ${date}`, 20, 56);

    // 4. Modern Table
    autoTable(doc, {
      startY: 65,
      head: [['REF', 'DESCRIPCIÓN DEL MATERIAL', 'CATEGORÍA', 'CANTIDAD']],
      body: materials.map(m => [m.codigo, m.nombre, m.tipo, m.cantidad]),
      theme: 'plain',
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [57, 169, 0], 
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'left',
        lineWidth: { bottom: 1.5 },
        lineColor: [57, 169, 0]
      },
      styles: { 
        fontSize: 8.5, 
        cellPadding: 5,
        textColor: [60, 60, 60],
        lineWidth: { bottom: 0.1 },
        lineColor: [240, 240, 240]
      },
      columnStyles: {
        0: { halign: 'center', fontStyle: 'bold', cellWidth: 25 },
        1: { cellWidth: 'auto' },
        3: { halign: 'center', fontStyle: 'bold', cellWidth: 20 }
      },
      didDrawPage: () => {
        addWatermark(doc);
        doc.setFontSize(7);
        doc.setTextColor(200);
        doc.text(`Sistema de Gestión Logimat - Página ${doc.getNumberOfPages()}`, 105, 285, { align: 'center' });
      }
    });

    doc.save(`Reporte_Logimat_${Date.now()}.pdf`);
  } catch (error) {
    console.error("PDF Error:", error);
    doc.save('Reporte.pdf');
  }
};

export const generateSingleMaterialPDF = async (material: Material) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleString('es-CO');

  try {
    const logimatLogo = await getBase64ImageFromUrl('/LogoLogitmat_sin_fondo.png');
    const senaLogo = await getBase64ImageFromUrl('/logo-sena-negro.png');

    // Watermark (Centered and small)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: 0.04 }));
    doc.addImage(logimatLogo, 'PNG', pageWidth / 2 - 40, pageHeight / 2 - 40, 80, 80);
    doc.restoreGraphicsState();

    // Small Logos in Header
    doc.addImage(logimatLogo, 'PNG', 20, 12, 12, 12);
    doc.addImage(senaLogo, 'PNG', 185, 12, 10, 10);

    // Header
    doc.setFontSize(24);
    doc.setTextColor(57, 169, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGIMAT', 35, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('FICHA TÉCNICA OFICIAL', 35, 28);

    doc.setDrawColor(57, 169, 0);
    doc.setLineWidth(1);
    doc.line(20, 35, 60, 35);

    // Information Section
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text('INFORMACIÓN DEL REGISTRO', 20, 55);

    const drawRow = (label: string, value: string, y: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(57, 169, 0);
        doc.text(label.toUpperCase(), 20, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text(value.toString(), 20, y + 8);
        
        doc.setDrawColor(245, 245, 245);
        doc.setLineWidth(0.5);
        doc.line(20, y + 12, 190, y + 12);
    };

    drawRow('Referencia del Material', material.codigo.toString(), 70);
    drawRow('Nombre del Artículo', material.nombre, 95);
    drawRow('Categoría / Tipo', material.tipo, 120);
    drawRow('Stock en Bodega', `${material.cantidad} UNIDADES`, 145);

    // Signature Area
    doc.setDrawColor(200);
    doc.line(70, 240, 140, 240);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Firma Autorizada', 105, 245, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(180);
    doc.text(`Generado el ${date} - ID: ${Date.now()}`, 20, 285);

    doc.save(`Ficha_${material.codigo}.pdf`);
  } catch (error) {
    console.error("PDF Error:", error);
    doc.save('Ficha.pdf');
  }
};
