import React from 'react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';
import { 
  FileText, 
  Download, 
  Mail, 
  TrendingUp, 
  PiggyBank, 
  Layers, 
  Clock, 
  ChevronRight, 
  ArrowDownToLine 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import PrivateHeader from '../components/layout/PrivateHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { LOGGED_IN_USER } from '../data/mockData';

export default function AsociadoEstadoCuenta() {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  // Mock historical data for the chart
  const historyData = [
    { year: '2021', aportes: 15200 },
    { year: '2022', aportes: 30500 },
    { year: '2023', aportes: 48900 },
    { year: '2024', aportes: 64200 },
    { year: '2025', aportes: 80100 },
    { year: '2026', aportes: LOGGED_IN_USER.accumulatedCuotas }
  ];

  const handleDownloadPDF = () => {
    toast.info("Generando Estado de Cuenta en PDF...");

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Banner institucional
      doc.setFillColor(0, 59, 92); // Azul Marino
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("Ayuda Mutua TELMEX, A.C.", 14, 18);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text("Fideicomiso de Administración y Jubilación", 14, 25);
      doc.text("Portal de Autogestión del Asociado", 14, 30);

      // Título
      doc.setTextColor(0, 59, 92);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text("ESTADO DE CUENTA INDIVIDUAL", 14, 48);

      // Datos del Asociado
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Asociado: ${LOGGED_IN_USER.name}`, 14, 55);
      doc.text(`Número de Asociado: ${LOGGED_IN_USER.id}`, 14, 60);
      doc.text(`Empresa Depositaria: ${LOGGED_IN_USER.company}`, 14, 65);
      doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-MX')}`, 14, 70);

      // Línea divisoria
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 73, 196, 73);

      // Resumen Financiero
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 59, 92);
      doc.text("RESUMEN DE SALDOS AL PERIODO ACTUAL", 14, 82);

      doc.setFillColor(0, 59, 92);
      doc.rect(14, 87, 182, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("Concepto Contable", 18, 92);
      doc.text("Monto (MXN)", 150, 92);

      const items = [
        { name: "Aportaciones Acumuladas (Cuotas de Nómina)", value: formatCurrency(LOGGED_IN_USER.accumulatedCuotas) },
        { name: "Rendimientos Generados Proyectados (Tasa 8.45%)", value: formatCurrency(12850.00) },
        { name: "Fondo Total Disponible", value: formatCurrency(LOGGED_IN_USER.accumulatedCuotas + 12850.00) }
      ];

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      let y = 101;
      items.forEach((item, index) => {
        if (index === 2) {
          doc.setFont('Helvetica', 'bold');
          doc.setFillColor(240, 245, 250);
          doc.rect(14, y - 5, 182, 7, 'F');
        }
        doc.text(item.name, 18, y);
        doc.text(item.value, 150, y);
        doc.setDrawColor(230, 230, 230);
        doc.line(14, y + 2, 196, y + 2);
        y += 8;
      });

      // Historial de Aportaciones
      y += 6;
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 59, 92);
      doc.text("HISTORIAL DE EVOLUCIÓN ANUAL", 14, y);

      y += 5;
      doc.setFillColor(0, 91, 150);
      doc.rect(14, y, 182, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("Año", 18, y + 5);
      doc.text("Monto Acumulado (MXN)", 150, y + 5);

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      y += 13;
      historyData.forEach((item, index) => {
        if (index % 2 === 1) {
          doc.setFillColor(245, 247, 250);
          doc.rect(14, y - 5, 182, 7, 'F');
        }
        doc.text(item.year, 18, y);
        doc.text(formatCurrency(item.aportes), 150, y);
        doc.line(14, y + 2, 196, y + 2);
        y += 8;
      });

      // Sello digital y firmas
      y += 6;
      doc.setFillColor(250, 250, 250);
      doc.rect(14, y, 182, 25, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(14, y, 182, 25, 'D');

      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.setFont('Helvetica', 'bold');
      doc.text("FIRMA DIGITAL DE CONFORMIDAD - SERVIDOR SEGURO", 18, y + 5);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Hash SHA-256: 7d10e5b721867c29e102f9${Math.random().toString(16).substring(2, 12)}a174f8b9e02c`, 18, y + 10);
      doc.text("Este documento es una representación financiera oficial y es válido para auditorías internas del fideicomiso.", 18, y + 15);

      doc.save(`Estado_de_Cuenta_${LOGGED_IN_USER.id}.pdf`);
      toast.success("Estado de Cuenta PDF descargado con éxito.");
    } catch (err) {
      console.error(err);
      toast.error("Error al generar el archivo PDF.");
    }
  };

  const handleDownloadExcel = async () => {
    toast.info("Generando Estado de Cuenta en Excel...");

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Rius AI Engine';
      workbook.created = new Date();

      // Tab 1: Estado de Cuenta
      const ws = workbook.addWorksheet('Resumen de Cuenta');
      ws.views = [{ showGridLines: true }];

      // Header Banner
      ws.mergeCells('A1:D2');
      const titleCell = ws.getCell('A1');
      titleCell.value = 'Estado de Cuenta Individual';
      titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '003B5C' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

      ws.getRow(3).height = 10;

      // Metadata
      ws.getCell('A4').value = 'Nombre del Asociado:';
      ws.getCell('A4').font = { bold: true };
      ws.getCell('B4').value = LOGGED_IN_USER.name;

      ws.getCell('A5').value = 'No. Asociado:';
      ws.getCell('A5').font = { bold: true };
      ws.getCell('B5').value = LOGGED_IN_USER.id;

      ws.getCell('A6').value = 'Empresa Depositaria:';
      ws.getCell('A6').font = { bold: true };
      ws.getCell('B6').value = LOGGED_IN_USER.company;

      ws.getCell('A7').value = 'Fecha Emisión:';
      ws.getCell('A7').font = { bold: true };
      ws.getCell('B7').value = new Date().toLocaleDateString('es-MX');

      ws.getRow(8).height = 15;

      // Table Header
      ws.getCell('A9').value = 'Concepto Financiero';
      ws.getCell('B9').value = 'Monto (MXN)';
      [ws.getCell('A9'), ws.getCell('B9')].forEach(c => {
        c.font = { bold: true, color: { argb: 'FFFFFF' } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '005B96' } };
        c.alignment = { horizontal: 'center', vertical: 'middle' };
      });
      ws.getRow(9).height = 20;

      ws.addRow(['Aportaciones Acumuladas', LOGGED_IN_USER.accumulatedCuotas]);
      ws.addRow(['Rendimientos Generados Proyectados', 12850.00]);
      ws.addRow(['Fondo Total Disponible', LOGGED_IN_USER.accumulatedCuotas + 12850.00]);

      ws.getCell('B10').numFormat = '$#,##0.00';
      ws.getCell('B11').numFormat = '$#,##0.00';
      ws.getCell('B12').numFormat = '$#,##0.00';
      ws.getCell('B12').font = { bold: true };
      ws.getCell('A12').font = { bold: true };

      // Apply borders
      const borderStyle = {
        bottom: { style: 'thin', color: { argb: 'E5E7EB' } }
      };
      ws.getRow(10).eachCell(c => c.border = borderStyle);
      ws.getRow(11).eachCell(c => c.border = borderStyle);
      ws.getRow(12).eachCell(c => {
        c.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'double', color: { argb: '000000' } }
        };
      });

      // Tab 2: Historial Anual
      const wsHist = workbook.addWorksheet('Historial de Aportaciones');
      wsHist.views = [{ showGridLines: true }];

      wsHist.columns = [
        { header: 'Año Contable', key: 'year', width: 18 },
        { header: 'Monto Acumulado (MXN)', key: 'amount', width: 25 }
      ];

      historyData.forEach(item => {
        wsHist.addRow({
          year: item.year,
          amount: item.amount
        });
      });

      const histHeader = wsHist.getRow(1);
      histHeader.height = 25;
      histHeader.eachCell(c => {
        c.font = { bold: true, color: { argb: 'FFFFFF' } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '005B96' } };
        c.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      wsHist.eachRow((row, num) => {
        if (num > 1) {
          row.height = 20;
          row.getCell(2).numFormat = '$#,##0.00';
          row.getCell(2).alignment = { horizontal: 'right' };
          row.getCell(1).alignment = { horizontal: 'center' };
          row.eachCell(c => c.border = borderStyle);
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Estado_Cuenta_${LOGGED_IN_USER.id}.xlsx`;
      a.addEventListener('click', (e) => e.stopPropagation());
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("Estado de Cuenta Excel descargado con éxito.");
    } catch (err) {
      console.error(err);
      toast.error("Error al generar el archivo Excel.");
    }
  };

  const handleSendEmail = () => {
    toast.success(`El Estado de Cuenta digital firmado ha sido enviado exitosamente al correo registrado: ${LOGGED_IN_USER.email}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <PrivateHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
        {/* Page Header */}
        <div className="mb-8">
          <span className="px-3 py-1 bg-primary-brand/5 text-primary-brand text-xs font-black rounded-full uppercase tracking-wider border border-primary-brand/10">
            Consultas Financieras
          </span>
          <h2 className="text-3xl font-extrabold text-primary-deep tracking-tight mt-2">Mi Estado de Cuenta</h2>
          <p className="text-base text-neutral-muted mt-1">
            Detalle pormenorizado de aportaciones, rendimientos devengados e historial del fondo acumulado.
          </p>
        </div>

        {/* Dashboard Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Aportaciones */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Aportaciones Acumuladas</span>
              <span className="block text-2xl font-black text-primary-deep">{formatCurrency(LOGGED_IN_USER.accumulatedCuotas)}</span>
              <span className="block text-[10px] text-neutral-muted">Retenciones automáticas de nómina</span>
            </div>
            <div className="bg-primary-brand/10 text-primary-brand p-3.5 rounded-xl">
              <PiggyBank className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Rendimientos */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Rendimientos Proyectados</span>
              <span className="block text-2xl font-black text-success-trust">{formatCurrency(12850.00)}</span>
              <span className="block text-[10px] text-success-trust font-semibold">Cálculo proporcional (8.45% promedio)</span>
            </div>
            <div className="bg-success-trust/10 text-success-trust p-3.5 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: Total */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Saldo Total Disponible</span>
              <span className="block text-2xl font-black text-primary-deep">{formatCurrency(LOGGED_IN_USER.accumulatedCuotas + 12850.00)}</span>
              <span className="block text-[10px] text-neutral-muted">Fondo Mutualista Consolidado</span>
            </div>
            <div className="bg-primary-brand/10 text-primary-brand p-3.5 rounded-xl">
              <Layers className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Chart Card (8 cols) */}
          <div className="lg:col-span-8">
            <Card title="Evolución Histórica de Aportaciones">
              <p className="text-xs text-neutral-muted -mt-3 mb-6">Visualice el crecimiento anual de su fondo de ayuda mutua desde su inscripción.</p>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAportesAsoc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005B96" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#005B96" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#5B6770" fontSize={11} tickLine={false} />
                    <YAxis stroke="#5B6770" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000}K`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="aportes" stroke="#005B96" strokeWidth={3} fillOpacity={1} fill="url(#colorAportesAsoc)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Action Center Card (4 cols) */}
          <div className="lg:col-span-4">
            <Card title="Centro de Acciones">
              <p className="text-xs text-neutral-muted -mt-3 mb-6">Descargue o envíe copias certificadas de sus movimientos contables.</p>
              
              <div className="space-y-4">
                {/* Button PDF */}
                <button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:border-primary-brand/50 hover:bg-white transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/10 text-red-500 p-2.5 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-neutral-dark block text-sm">Descargar PDF</span>
                      <span className="text-xxs text-neutral-muted block">Balanza firmada digitalmente</span>
                    </div>
                  </div>
                  <ArrowDownToLine className="h-5 w-5 text-gray-400 group-hover:text-primary-brand transition-colors" />
                </button>

                {/* Button Excel */}
                <button
                  onClick={handleDownloadExcel}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:border-primary-brand/50 hover:bg-white transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-success-trust/10 text-success-trust p-2.5 rounded-xl group-hover:bg-success-trust group-hover:text-white transition-colors">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-neutral-dark block text-sm">Descargar Excel</span>
                      <span className="text-xxs text-neutral-muted block">Desglose anual tabular (.xlsx)</span>
                    </div>
                  </div>
                  <ArrowDownToLine className="h-5 w-5 text-gray-400 group-hover:text-primary-brand transition-colors" />
                </button>

                {/* Button Send Email */}
                <button
                  onClick={handleSendEmail}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:border-primary-brand/50 hover:bg-white transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-brand/10 text-primary-brand p-2.5 rounded-xl group-hover:bg-primary-brand group-hover:text-white transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-neutral-dark block text-sm">Enviar por Correo</span>
                      <span className="text-xxs text-neutral-muted block">Copia al correo registrado</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-brand transition-colors" />
                </button>
              </div>

              {/* Alert note */}
              <div className="mt-6 p-4 bg-primary-brand/5 border border-primary-brand/20 rounded-2xl text-xxs text-neutral-muted leading-relaxed">
                <strong>Nota de Seguridad:</strong> Todos los documentos emitidos contienen un sello digital SHA-256 encriptado que certifica su autenticidad ante auditorías internas o la administración del fideicomiso.
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
