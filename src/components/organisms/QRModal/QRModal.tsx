import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FaDownload, FaTimes, FaFilePdf, FaPrint } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import './QRModal.css';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    codigo_material: number;
    nombre: string;
    tipo: string;
  };
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, material }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const qrText = `LOGIMAT - SENA\n------------------\nID: ${material.codigo_material}\nMATERIAL: ${material.nombre}\nCATEGORIA: ${material.tipo}\n------------------\nSistema de Gestión Huila`;

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${material.nombre}.png`;
      link.click();
    }
  };

  const generatePDFLabel = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [80, 50] // Standard label size
    });

    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const qrImage = canvas.toDataURL('image/png');

    // Design the label
    doc.setFillColor(57, 169, 0); // SENA Green
    doc.rect(0, 0, 80, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ACTIVO LOGIMAT - SENA', 40, 5.5, { align: 'center' });

    // Logo (placeholder or text for now, could add actual logo if needed)
    doc.setTextColor(57, 169, 0);
    doc.setFontSize(8);
    doc.text('SENA REGIONAL HUILA', 5, 13);

    // QR Code
    doc.addImage(qrImage, 'PNG', 5, 15, 30, 30);

    // Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`ID: ${material.codigo_material}`, 38, 18);
    
    doc.setFontSize(10);
    doc.text(material.nombre.substring(0, 20), 38, 25);
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Tipo: ${material.tipo}`, 38, 30);
    
    doc.setDrawColor(200);
    doc.line(38, 32, 75, 32);
    
    doc.setFontSize(7);
    doc.text('Escanee para verificar', 38, 36);

    doc.save(`Etiqueta_${material.nombre}.pdf`);
  };

  return (
    <div className="qr-modal-overlay">
      <div className="qr-modal-content premium">
        <button className="qr-modal-close" onClick={onClose}><FaTimes /></button>
        
        <div className="qr-modal-header">
          <div className="sena-accent-bar"></div>
          <h3>Etiqueta de Inventario</h3>
          <p className="material-name-qr">{material.nombre}</p>
        </div>

        <div className="qr-main-section">
            <div className="qr-display" ref={qrRef}>
            <QRCodeCanvas 
                value={qrText} 
                size={180}
                level={"H"}
                includeMargin={true}
                imageSettings={{
                    src: "/LogoLogitmat_sin_fondo.png",
                    height: 35,
                    width: 35,
                    excavate: true,
                }}
            />
            </div>
            
            <div className="qr-details-side">
                <div className="qr-detail-item">
                    <label>Código Interno</label>
                    <span># {material.codigo_material}</span>
                </div>
                <div className="qr-detail-item">
                    <label>Categoría</label>
                    <span>{material.tipo}</span>
                </div>
                <div className="qr-detail-item">
                    <label>Ubicación</label>
                    <span>Bodega Principal</span>
                </div>
            </div>
        </div>

        <div className="qr-actions-grid">
            <button className="btn-qr-action secondary" onClick={downloadQR}>
                <FaDownload /> Imagen PNG
            </button>
            <button className="btn-qr-action primary" onClick={generatePDFLabel}>
                <FaFilePdf /> Generar PDF
            </button>
        </div>

        <div className="qr-footer-note">
            <FaPrint /> Listo para impresión térmica (80x50mm)
        </div>
      </div>
    </div>
  );
};
