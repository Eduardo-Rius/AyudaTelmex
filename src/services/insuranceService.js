// src/services/insuranceService.js
import { PDFDocument, StandardFonts } from 'pdf-lib';
import formatoPdfUrl from '../../FORMATO DE POLIZA 2026.pdf?url';

/** Retrieve insurance policy for an associate.
 * Returns demo data. Empty strings are used for fields that have no value.
 */
export const getInsurancePolicyByAssociate = (associateId) => {
  const DEMO_ASSOCIATE_ID = '902847';
  if (associateId !== DEMO_ASSOCIATE_ID) {
    return null;
  }
  return {
    insurer: 'INBURSA',
    company: 'INBURSA',
    policyNumber: 'POL-2025-00001',
    coverageType: 'Fallecimiento',
    insuredAmount: 500000,
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    validity: '2025-01-01 - 2025-12-31',
    status: 'ACTIVE',
    associate: {
      name: 'Eduardo Rius Torres',
      id: '902847',
      company: 'Ayuda Mutua TELMEX',
      paternalSurname: 'Rius',
      maternalSurname: 'Torres',
      firstName: 'Eduardo',
      birthDate: '', 
      rfc: '',
      address: {
        street: '',
        colony: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
      },
      policyInfo: {
        expediente: '',
        city: '',
        joinDate: '',
        associateType: '',
      },
    },
    coverages: {
      death: '',
      accidentalDeath: '',
      disability: ''
    }
  };
};

export const generateInbursaPDF = async (payload) => {
  const existingPdfBytes = await fetch(formatoPdfUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { height } = firstPage.getSize();
  
  const drawText = (text, x, y, size = 10) => {
    if (!text) return;
    firstPage.drawText(String(text), {
      x,
      y: height - y,
      size,
      font,
    });
  };

  const a = payload.associate || {};
  const pi = a.policyInfo || {};
  const addr = a.address || {};
  const cov = payload.coverages || {};

  // 1. No. de Certificado (top right box)
  drawText(payload.policy?.policyNumber || '', 430, 110);
  
  // 2. Datos del Asegurado
  drawText(a.paternalSurname || '', 50, 245);
  drawText(a.maternalSurname || '', 200, 245);
  drawText(a.firstName || '', 350, 245);
  drawText(a.birthDate || '', 480, 245);

  // 3. Domicilio
  drawText(addr.street || '', 50, 315);
  drawText(addr.colony || '', 200, 315);
  drawText(addr.city || '', 350, 315);
  drawText(addr.state || '', 450, 315);
  drawText(addr.postalCode || '', 500, 315);
  drawText(addr.phone || '', 50, 340);

  // 4. Datos Póliza (first cell is No. de Póliza)
  drawText(payload.policy?.policyNumber || '', 50, 395);
  drawText(pi.expediente || '', 150, 395);
  drawText(pi.city || '', 250, 395);
  drawText(pi.joinDate || '', 350, 395);
  drawText(pi.associateType || '', 450, 395);

  // 5. Sumas Aseguradas
  drawText(cov.death || '', 50, 465);
  drawText(cov.accidentalDeath || '', 250, 465);
  drawText(cov.disability || '', 400, 465);

  // 6. Beneficiarios (sección BENEFICIARIOS)
  let by = 535;
  const ben = payload.beneficiaries || [];
  ben.forEach(b => {
    drawText(b.percentage ? `${b.percentage}%` : '', 50, by);
    drawText(b.paternalSurname || '', 100, by);
    drawText(b.maternalSurname || '', 200, by);
    drawText(b.firstName || b.name || '', 300, by);
    drawText(b.relationship || '', 430, by);
    drawText(b.age || '', 520, by);
    by += 15;
  });

  // 7. O en su defecto (Sustitutos) - Vaciado. No iteramos ni escribimos.

  // 8. Fecha
  drawText(new Date().toLocaleDateString(), 120, 755);

  // Generar PDF y descargar
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Seguro_Vida_Inbursa_POL-2025-00001.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return true;
};

export default {
  getInsurancePolicyByAssociate,
  generateInbursaPDF,
};
