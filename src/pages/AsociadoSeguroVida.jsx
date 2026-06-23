// src/pages/AsociadoSeguroVida.jsx
import React, { useEffect, useRef, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PrivateHeader from '../components/layout/PrivateHeader';
import Footer from '../components/layout/Footer';
import { LOGGED_IN_USER } from '../data/mockData';
import { getInsurancePolicyByAssociate } from '../services/insuranceService';
import { getBeneficiariesByAssociate } from '../services/beneficiariesService';
import { createAuditLog } from '../services/auditService';
import ayudaLogo from '../../Ayuda Telmex Logo.jpeg';
import inbursaLogo from '../../Inbursa Logo.png';
import InbursaPolicyForm from '../components/insurance/InbursaPolicyForm';

export default function AsociadoSeguroVida() {
  const [policy, setPolicy] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef(null);

  useEffect(() => {
    const associateId = LOGGED_IN_USER.id;
    const fetchedPolicy = getInsurancePolicyByAssociate(associateId);
    const fetchedBeneficiaries = getBeneficiariesByAssociate(associateId);
    setPolicy(fetchedPolicy);
    setBeneficiaries(fetchedBeneficiaries);
    setLoading(false);
  }, []);

  const handleDownload = async () => {
    if (!policy || !pdfRef.current) return;

    try {
      const { jsPDF } = await import('jspdf');
      const { toPng } = await import('html-to-image');

      try {
        const imgData = await toPng(pdfRef.current, { cacheBust: true, backgroundColor: '#ffffff' });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Seguro_Vida_Inbursa_${policy.policyNumber}.pdf`);
        return;
      } catch (canvasError) {
        console.error('Falló html-to-image, usando fallback simple:', canvasError);
      }

      // Fallback obligatorio
      const fallbackPdf = new jsPDF('p', 'mm', 'a4');
      fallbackPdf.text('Seguro de Vida – Inbursa', 20, 20);
      fallbackPdf.text(`Póliza: ${policy.policyNumber}`, 20, 35);
      fallbackPdf.text(`Cobertura: ${policy.coverageType}`, 20, 50);
      fallbackPdf.text(`Suma asegurada: $${policy.insuredAmount.toLocaleString()}`, 20, 65);
      fallbackPdf.text(`Vigencia: ${policy.validity}`, 20, 80);

      fallbackPdf.text('Beneficiarios:', 20, 100);
      beneficiaries.forEach((b, index) => {
        fallbackPdf.text(
          `${b.name} - ${b.relationship} - ${b.percentage}%`,
          25,
          115 + index * 10
        );
      });

      fallbackPdf.save(`Seguro_Vida_Inbursa_${policy.policyNumber}.pdf`);
    } catch (error) {
      console.error('Error general generando PDF:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>;
  }

  if (!policy) {
    return <div className="p-8">No se encontró póliza de seguro para el asociado.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <PrivateHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Card title="Seguro de Vida – Inbursa" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <img src={ayudaLogo} alt="Ayuda Telmex" className="h-14" />
              <img src={inbursaLogo} alt="Inbursa" className="h-14" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Detalle de la Póliza</h2>
            <div className="grid grid-cols-2 gap-4 text-lg mb-4">
              <div><strong>Número de póliza:</strong> {policy.policyNumber}</div>
              <div className="flex items-center"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">Vigente y Activa</span></div>
              <div><strong>Tipo de cobertura:</strong> {policy.coverageType}</div>
              <div><strong>Suma asegurada:</strong> ${policy.insuredAmount.toLocaleString()}</div>
              <div><strong>Vigencia:</strong> {policy.validity}</div>
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-2">Beneficiarios</h3>
            <table className="w-full text-left border-collapse mt-2">
              <thead>
                <tr>
                  <th className="border-b py-1">Nombre</th>
                  <th className="border-b py-1">Relación</th>
                  <th className="border-b py-1">% Participación</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((b) => (
                  <tr key={b.beneficiaryId}>
                    <td className="border-b py-1">{b.name}</td>
                    <td className="border-b py-1">{b.relationship}</td>
                    <td className="border-b py-1">{b.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 flex justify-end">
              <Button type="button" variant="primary" onClick={handleDownload}>
                Descargar PDF oficial
              </Button>
            </div>
          </Card>

          <Card title="Vista previa del formato oficial" className="p-6 mt-10 overflow-x-auto bg-gray-50">
            <div className="min-w-[800px] flex justify-center">
              <div ref={pdfRef}>
                <InbursaPolicyForm
                  associate={LOGGED_IN_USER}
                  policy={policy}
                  beneficiaries={beneficiaries}
                  substituteBeneficiaries={[]}
                />
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
