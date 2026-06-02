import React, { useState } from 'react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';
import { 
  ShieldCheck, 
  Briefcase, 
  TrendingUp, 
  Download, 
  Clock, 
  ShieldAlert, 
  PieChart as PieIcon, 
  TrendingUp as TrendIcon,
  CheckCircle2,
  Building,
  Calendar,
  Layers,
  Sparkles,
  Brain,
  FileText,
  FileSpreadsheet,
  FileCode,
  Lock,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminHeader from '../components/layout/AdminHeader';
import Card from '../components/common/Card';

export default function AdminDirectores() {
  const [reportState, setReportState] = useState({
    isOpen: false,
    type: '',
    name: '',
    progress: 0,
    status: '',
    isCompleted: false
  });

  const handleGenerateReport = (type, name) => {
    setReportState({
      isOpen: true,
      type: type === 'Excel_Aportaciones' ? 'Excel' : type,
      name,
      progress: 0,
      status: 'Iniciando conexión segura...',
      isCompleted: false
    });

    const steps = [
      { progress: 25, status: 'Conectando con el Servidor de Firmas...' },
      { progress: 50, status: 'Firmando digitalmente con FIEL (Firma Electrónica Avanzada)...' },
      { progress: 75, status: 'Generando sello digital y Hash SHA-256...' },
      { progress: 100, status: 'Verificación de integridad completada.' }
    ];

    let currentStep = 0;
    const interval = setInterval(async () => {
      if (currentStep < steps.length) {
        const targetStep = steps[currentStep];
        setReportState(prev => ({
          ...prev,
          progress: targetStep.progress,
          status: targetStep.status
        }));
        currentStep++;
      } else {
        clearInterval(interval);
        setReportState(prev => ({
          ...prev,
          isCompleted: true
        }));
        
        try {
          if (type === 'PDF') {
            const doc = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4'
            });

            // Header band
            doc.setFillColor(0, 59, 92);
            doc.rect(0, 0, 210, 35, 'F');

            // Header Text
            doc.setTextColor(255, 255, 255);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(22);
            doc.text("Ayuda Mutua TELMEX, A.C.", 14, 18);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(10);
            doc.text("Fideicomiso de Administración y Jubilación", 14, 25);
            doc.text("Portal de Gobierno Corporativo y Finanzas", 14, 30);

            // Document Title
            doc.setTextColor(0, 59, 92);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(14);
            doc.text("ESTADO DE CUENTA CONSOLIDADO", 14, 48);

            // Date and metadata
            doc.setFontSize(9);
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            const today = new Date().toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            doc.text(`Fecha de Emisión: ${today}`, 14, 53);
            doc.text("Periodo: Mayo 2026", 14, 58);
            doc.text("Estatus: Conciliado y Auditado", 14, 63);

            // Horizontal line
            doc.setDrawColor(200, 200, 200);
            doc.line(14, 66, 196, 66);

            // Main KPIs
            doc.setTextColor(0, 59, 92);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(12);
            doc.text("RESUMEN DE ACTIVOS DEL FONDO", 14, 75);

            // Box 1: Fondo Fideicomiso
            doc.setFillColor(245, 247, 250);
            doc.rect(14, 80, 55, 24, 'F');
            doc.setDrawColor(220, 225, 230);
            doc.rect(14, 80, 55, 24, 'D');
            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);
            doc.text("FONDO FIDEICOMISO", 18, 86);
            doc.setFontSize(11);
            doc.setFont('Helvetica', 'bold');
            doc.setTextColor(0, 59, 92);
            doc.text("$154,820,000.00", 18, 94);
            doc.setFontSize(7);
            doc.setTextColor(0, 168, 120);
            doc.text("✓ Activo", 18, 100);

            // Box 2: Rendimiento Anual
            doc.setFillColor(245, 247, 250);
            doc.rect(74, 80, 55, 24, 'F');
            doc.rect(74, 80, 55, 24, 'D');
            doc.setFontSize(8);
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(120, 120, 120);
            doc.text("RENDIMIENTO ANUAL", 78, 86);
            doc.setFontSize(14);
            doc.setFont('Helvetica', 'bold');
            doc.setTextColor(0, 168, 120);
            doc.text("8.45%", 78, 95);

            // Box 3: Cartera en Nómina
            doc.setFillColor(245, 247, 250);
            doc.rect(134, 80, 62, 24, 'F');
            doc.rect(134, 80, 62, 24, 'D');
            doc.setFontSize(8);
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(120, 120, 120);
            doc.text("CARTERA EN NÓMINA", 138, 86);
            doc.setFontSize(11);
            doc.setFont('Helvetica', 'bold');
            doc.setTextColor(0, 59, 92);
            doc.text("$12,400,000.00", 138, 94);
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            doc.text("Siniestralidad: 3.12%", 138, 100);

            // Asset Allocation Table Header
            doc.setFontSize(12);
            doc.setFont('Helvetica', 'bold');
            doc.setTextColor(0, 59, 92);
            doc.text("DISTRIBUCIÓN DE ACTIVOS", 14, 115);

            // Table background
            doc.setFillColor(0, 59, 92);
            doc.rect(14, 120, 182, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.setFont('Helvetica', 'bold');
            doc.text("Clase de Activo", 18, 125);
            doc.text("Porcentaje", 120, 125);
            doc.text("Monto Estimado (MXN)", 150, 125);

            // Table Rows
            const allocation = [
              { name: 'Deuda Gubernamental (CETES)', pct: '60%', amount: '$92,892,000.00' },
              { name: 'Renta Fija Corporativa', pct: '25%', amount: '$38,705,000.00' },
              { name: 'Fondo de Liquidez Diaria', pct: '15%', amount: '$23,223,000.00' }
            ];

            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
            let y = 134;
            allocation.forEach((item, index) => {
              if (index % 2 === 1) {
                doc.setFillColor(245, 247, 250);
                doc.rect(14, y - 5, 182, 7, 'F');
              }
              doc.text(item.name, 18, y);
              doc.text(item.pct, 120, y);
              doc.text(item.amount, 150, y);
              
              doc.setDrawColor(230, 230, 230);
              doc.line(14, y + 2, 196, y + 2);
              y += 8;
            });

            // Historical yields
            y += 4;
            doc.setFontSize(12);
            doc.setFont('Helvetica', 'bold');
            doc.setTextColor(0, 59, 92);
            doc.text("HISTÓRICO DE RENDIMIENTO ANUAL", 14, y);

            y += 5;
            doc.setFillColor(0, 91, 150);
            doc.rect(14, y, 182, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.setFont('Helvetica', 'bold');
            doc.text("Año", 18, y + 5);
            doc.text("Rendimiento (%)", 120, y + 5);

            const yieldHist = [
              { year: '2022', yield: '6.80%' },
              { year: '2023', yield: '7.20%' },
              { year: '2024', yield: '7.90%' },
              { year: '2025', yield: '8.30%' },
              { year: '2026 (Est.)', yield: '8.45%' }
            ];

            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
            y += 13;
            yieldHist.forEach((item, index) => {
              if (index % 2 === 1) {
                doc.setFillColor(245, 247, 250);
                doc.rect(14, y - 5, 182, 7, 'F');
              }
              doc.text(item.year, 18, y);
              doc.text(item.yield, 120, y);
              
              doc.setDrawColor(230, 230, 230);
              doc.line(14, y + 2, 196, y + 2);
              y += 8;
            });

            // Signature and seals
            y += 6;
            doc.setFillColor(250, 250, 250);
            doc.rect(14, y, 182, 28, 'F');
            doc.setDrawColor(220, 220, 220);
            doc.rect(14, y, 182, 28, 'D');

            doc.setFontSize(7);
            doc.setTextColor(100, 100, 100);
            doc.setFont('Helvetica', 'bold');
            doc.text("SELLO DIGITAL DE FIRMA ELECTRÓNICA AVANZADA (FIEL)", 18, y + 5);
            doc.setFont('Helvetica', 'normal');
            doc.text("SHA-256 Hash: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", 18, y + 10);
            doc.text("Autorizado por: C.P. Arturo Ramos - Socio PricewaterhouseCoopers (PwC)", 18, y + 15);
            doc.text("Fideicomiso Ayuda Mutua TELMEX, A.C. Todos los derechos reservados 2026.", 18, y + 20);

            const filename = `${name.replace(/\s+/g, '_')}_FIRMADO.pdf`;
            doc.save(filename);
            toast.success(`Reporte "${name}" firmado digitalmente y descargado con éxito.`);
          } else if (type === 'Excel') {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Rius AI Engine';
            workbook.lastModifiedBy = 'PwC Auditor';
            workbook.created = new Date();
            workbook.modified = new Date();

            const wsResumen = workbook.addWorksheet('Resumen de Conciliación');
            wsResumen.views = [{ showGridLines: true }];

            wsResumen.mergeCells('A1:F2');
            const titleCell = wsResumen.getCell('A1');
            titleCell.value = 'Auxiliar de Conciliación Mensual';
            titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFF' } };
            titleCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '003B5C' }
            };
            titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

            wsResumen.getRow(3).height = 15;

            wsResumen.getCell('A4').value = 'Periodo Contable:';
            wsResumen.getCell('A4').font = { bold: true };
            wsResumen.getCell('B4').value = 'Mayo 2026';

            wsResumen.getCell('A5').value = 'Fecha de Cierre:';
            wsResumen.getCell('A5').font = { bold: true };
            wsResumen.getCell('B5').value = new Date().toLocaleDateString('es-MX');

            wsResumen.getCell('A6').value = 'Auditor Externo:';
            wsResumen.getCell('A6').font = { bold: true };
            wsResumen.getCell('B6').value = 'PricewaterhouseCoopers (PwC)';

            wsResumen.mergeCells('B9:C9');
            wsResumen.getCell('B9').value = 'TOTAL RECAUDADO (MXN)';
            wsResumen.getCell('B9').font = { size: 9, bold: true, color: { argb: '5B6770' } };
            wsResumen.getCell('B9').alignment = { horizontal: 'center' };

            wsResumen.mergeCells('B10:C11');
            wsResumen.getCell('B10').value = 1686700;
            wsResumen.getCell('B10').font = { size: 16, bold: true, color: { argb: '003B5C' } };
            wsResumen.getCell('B10').numFormat = '$#,##0.00';
            wsResumen.getCell('B10').alignment = { vertical: 'middle', horizontal: 'center' };

            wsResumen.mergeCells('E9:F9');
            wsResumen.getCell('E9').value = 'EFICIENCIA OPERATIVA';
            wsResumen.getCell('E9').font = { size: 9, bold: true, color: { argb: '5B6770' } };
            wsResumen.getCell('E9').alignment = { horizontal: 'center' };

            wsResumen.mergeCells('E10:F11');
            wsResumen.getCell('E10').value = 0.984;
            wsResumen.getCell('E10').font = { size: 18, bold: true, color: { argb: '00A878' } };
            wsResumen.getCell('E10').numFormat = '0.0%';
            wsResumen.getCell('E10').alignment = { vertical: 'middle', horizontal: 'center' };

            const cardBorder = {
              top: { style: 'thin', color: { argb: 'D3D3D3' } },
              left: { style: 'thin', color: { argb: 'D3D3D3' } },
              bottom: { style: 'thin', color: { argb: 'D3D3D3' } },
              right: { style: 'thin', color: { argb: 'D3D3D3' } }
            };
            for(let r=9; r<=11; r++) {
              for(let c=2; c<=3; c++) wsResumen.getCell(r, c).border = cardBorder;
              for(let c=5; c<=6; c++) wsResumen.getCell(r, c).border = cardBorder;
            }

            const wsDetalle = workbook.addWorksheet('Detalle por Empresa');
            wsDetalle.views = [{ showGridLines: true }];

            wsDetalle.columns = [
              { header: 'Razón Social de la Empresa', key: 'company', width: 45 },
              { header: 'Fecha Carga', key: 'date', width: 15 },
              { header: 'Registros', key: 'records', width: 12 },
              { header: 'Importe Recibido (MXN)', key: 'total', width: 22 },
              { header: 'Estatus Conciliación', key: 'status', width: 20 }
            ];

            const mockContributions = [
              { company: "TELMEX (Teléfonos de México, S.A.B. de C.V.)", date: "28/05/2026", records: 5420, total: 1245600.00, status: "recibido" },
              { company: "TELNOR (Telégrafos y Teléfonos del Noroeste, S.A. de C.V.)", date: "28/05/2026", records: 840, total: 193200.00, status: "recibido" },
              { company: "Red Uno S.A. de C.V.", date: "27/05/2026", records: 310, total: 71300.00, status: "recibido" },
              { company: "Uninet S.A. de C.V.", date: "N/A", records: 0, total: 0.00, status: "pendiente" },
              { company: "Consorcio Red Uno", date: "25/05/2026", records: 120, total: 27600.00, status: "inconsistente" },
              { company: "Triara (Vance Asesoría de Negocios, S.A. de C.V.)", date: "26/05/2026", records: 150, total: 34500.00, status: "recibido" },
              { company: "CTAM (Compañía de Teléfonos y Bienes Raíces)", date: "27/05/2026", records: 95, total: 21850.00, status: "recibido" },
              { company: "Telvista S.A. de C.V.", date: "28/05/2026", records: 215, total: 49450.00, status: "recibido" },
              { company: "Scitum S.A. de C.V.", date: "28/05/2026", records: 80, total: 18400.00, status: "recibido" },
              { company: "Claro Video S.A. de C.V.", date: "N/A", records: 0, total: 0.00, status: "pendiente" },
              { company: "Uno TV (Compañía de Información Deportiva)", date: "25/05/2026", records: 45, total: 10350.00, status: "inconsistente" },
              { company: "Editorial Telmex", date: "26/05/2026", records: 55, total: 12650.00, status: "recibido" },
              { company: "Fundación Carlos Slim", date: "27/05/2026", records: 60, total: 13800.00, status: "recibido" },
              { company: "Sanborns Hermanos (Seguros de grupo)", date: "N/A", records: 0, total: 0.00, status: "pendiente" },
              { company: "Sears Roebuck de México (Seguros de grupo)", date: "27/05/2026", records: 110, total: 25300.00, status: "recibido" }
            ];

            mockContributions.forEach(c => {
              wsDetalle.addRow({
                company: c.company,
                date: c.date,
                records: c.records,
                total: c.total,
                status: c.status.toUpperCase()
              });
            });

            const headerRow = wsDetalle.getRow(1);
            headerRow.height = 25;
            headerRow.eachCell((cell) => {
              cell.font = { name: 'Calibri', bold: true, color: { argb: 'FFFFFF' } };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '005B96' }
              };
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });

            wsDetalle.eachRow((row, rowNumber) => {
              if (rowNumber > 1) {
                row.height = 20;
                
                const cellTotal = row.getCell(4);
                cellTotal.numFormat = '$#,##0.00';
                cellTotal.alignment = { horizontal: 'right' };
                
                const cellRecords = row.getCell(3);
                cellRecords.numFormat = '#,##0';
                cellRecords.alignment = { horizontal: 'right' };
                
                const cellDate = row.getCell(2);
                cellDate.alignment = { horizontal: 'center' };
                
                const cellStatus = row.getCell(5);
                cellStatus.alignment = { horizontal: 'center' };
                
                const statusText = cellStatus.value;
                if (statusText === 'RECIBIDO') {
                  cellStatus.font = { color: { argb: '008F65' }, bold: true };
                } else if (statusText === 'INCONSISTENTE') {
                  cellStatus.font = { color: { argb: 'D9383A' }, bold: true };
                } else {
                  cellStatus.font = { color: { argb: '707070' }, italic: true };
                }
                
                row.eachCell((cell) => {
                  cell.border = {
                    bottom: { style: 'thin', color: { argb: 'F0F0F0' } }
                  };
                });
              }
            });

            const totalRowNumber = mockContributions.length + 2;
            wsDetalle.getCell(`A${totalRowNumber}`).value = 'Total Consolidado';
            wsDetalle.getCell(`A${totalRowNumber}`).font = { bold: true };
            wsDetalle.getCell(`C${totalRowNumber}`).value = { formula: `=SUM(C2:C${totalRowNumber-1})` };
            wsDetalle.getCell(`C${totalRowNumber}`).font = { bold: true };
            wsDetalle.getCell(`C${totalRowNumber}`).numFormat = '#,##0';
            wsDetalle.getCell(`D${totalRowNumber}`).value = { formula: `=SUM(D2:D${totalRowNumber-1})` };
            wsDetalle.getCell(`D${totalRowNumber}`).font = { bold: true };
            wsDetalle.getCell(`D${totalRowNumber}`).numFormat = '$#,##0.00';

            const fRow = wsDetalle.getRow(totalRowNumber);
            fRow.height = 22;
            fRow.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'double', color: { argb: '000000' } }
              };
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${name.replace(/\s+/g, '_')}_FIRMADO.xlsx`;
            a.addEventListener('click', (e) => e.stopPropagation());
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }, 100);

            toast.success(`Reporte "${name}" firmado digitalmente y descargado con éxito.`);
          } else if (type === 'Excel_Aportaciones') {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Rius AI Engine';
            const ws = workbook.addWorksheet('Histórico de Aportaciones');
            ws.views = [{ showGridLines: true }];

            ws.columns = [
              { header: 'ID Trámite', key: 'id', width: 15 },
              { header: 'Asociado', key: 'name', width: 30 },
              { header: 'Tipo Trámite', key: 'type', width: 35 },
              { header: 'Monto (MXN)', key: 'amount', width: 20 },
              { header: 'Estatus', key: 'status', width: 18 },
              { header: 'Fecha de Trámite', key: 'date', width: 18 }
            ];

            const mockRecent = [
              { id: "T-8930", name: "Juan Manuel López", type: "Recuperación de Cuotas", amount: 92400.00, status: "Pendiente", date: "29/05/2026" },
              { id: "T-8929", name: "Silvia Martínez", type: "Actualización de Beneficiarios", amount: null, status: "Pendiente", date: "29/05/2026" },
              { id: "T-8925", name: "Carlos Mendoza", type: "Premio al Desempeño Académico", amount: 15000.00, status: "En Revisión", date: "28/05/2026" },
              { id: "T-8924", name: "Teresa Sánchez", type: "Registro Evento Boliche", amount: null, status: "Aprobado", date: "28/05/2026" },
              { id: "T-8922", name: "Raúl García", type: "Recuperación de Cuotas", amount: 78500.00, status: "Aprobado", date: "27/05/2026" },
              { id: "T-8921", name: "Eduardo Rius Torres", type: "Recuperación de Cuotas", amount: 85420.00, status: "En Validación", date: "25/05/2026" },
              { id: "T-8874", name: "Eduardo Rius Torres", type: "Premio al Desempeño Académico", amount: 10000.00, status: "En Revisión", date: "20/05/2026" },
              { id: "T-8790", name: "Carmen Ortiz", type: "Actualización de Beneficiarios", amount: null, status: "Aprobado", date: "26/05/2026" }
            ];

            mockRecent.forEach(t => {
              ws.addRow({
                id: t.id,
                name: t.name,
                type: t.type,
                amount: t.amount || 0,
                status: t.status,
                date: t.date
              });
            });

            const headerRow = ws.getRow(1);
            headerRow.height = 25;
            headerRow.eachCell((cell) => {
              cell.font = { name: 'Calibri', bold: true, color: { argb: 'FFFFFF' } };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '005B96' }
              };
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });

            ws.eachRow((row, rowNumber) => {
              if (rowNumber > 1) {
                row.height = 20;
                
                const cellAmount = row.getCell(4);
                cellAmount.numFormat = '$#,##0.00';
                cellAmount.alignment = { horizontal: 'right' };
                
                const cellId = row.getCell(1);
                cellId.alignment = { horizontal: 'center' };
                
                const cellDate = row.getCell(6);
                cellDate.alignment = { horizontal: 'center' };
                
                const cellStatus = row.getCell(5);
                cellStatus.alignment = { horizontal: 'center' };
                
                const statusText = cellStatus.value;
                if (statusText === 'Aprobado') {
                  cellStatus.font = { color: { argb: '008F65' }, bold: true };
                } else if (statusText === 'Pendiente') {
                  cellStatus.font = { color: { argb: 'F6A623' }, bold: true };
                } else {
                  cellStatus.font = { color: { argb: '005B96' }, bold: true };
                }
                
                row.eachCell((cell) => {
                  cell.border = {
                    bottom: { style: 'thin', color: { argb: 'F0F0F0' } }
                  };
                });
              }
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${name.replace(/\s+/g, '_')}_FIRMADO.xlsx`;
            a.addEventListener('click', (e) => e.stopPropagation());
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }, 100);

            toast.success(`Reporte "${name}" firmado digitalmente y descargado con éxito.`);
          }
        } catch (error) {
          console.error(error);
          toast.error("Error al generar el reporte real.");
        }
      }
    }, 500);
  };
  
  // Data for Investment Allocation Pie Chart
  const allocationData = [
    { name: 'Deuda Gubernamental (CETES)', value: 60, color: '#003B5C' },
    { name: 'Renta Fija Corporativa', value: 25, color: '#005B96' },
    { name: 'Fondo de Liquidez Diaria', value: 15, color: '#00A6D6' }
  ];

  // Data for Annual Yield Bar Chart
  const yieldData = [
    { year: '2022', rendimiento: 6.80 },
    { year: '2023', rendimiento: 7.20 },
    { year: '2024', rendimiento: 7.90 },
    { year: '2025', rendimiento: 8.30 },
    { year: '2026 (Est)', rendimiento: 8.45 }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  return (
    <div className="flex bg-neutral-bg min-h-screen">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8 text-left">
          
          {/* Page Header */}
          <div className="mb-8">
            <span className="px-3 py-1 bg-primary-deep/5 text-primary-deep text-xs font-black rounded-full uppercase tracking-wider border border-primary-brand/10">
              Acceso Restringido: Directores y Auditoría
            </span>
            <h2 className="text-3xl font-extrabold text-primary-deep tracking-tight mt-2">Portal de Gobierno Corporativo y Finanzas</h2>
            <p className="text-base text-neutral-muted mt-1">
              Supervisión de balances consolidados, rendimientos y dictámenes de auditoría externa del fideicomiso.
            </p>
          </div>

          {/* Top KPI Cards (Identical premium style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Total Trust Funds */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
              <div className="space-y-1">
                <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Fondo de Fideicomiso</span>
                <span className="block text-2xl font-black text-primary-deep">{formatCurrency(154820000)}</span>
              </div>
              <div className="bg-primary-brand/10 text-primary-brand p-3.5 rounded-xl">
                <Layers className="h-7 w-7" />
              </div>
            </div>

            {/* Card 2: Annual yield */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
              <div className="space-y-1">
                <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Rendimiento Anual</span>
                <span className="block text-2xl font-black text-success-trust">8.45%</span>
              </div>
              <div className="bg-success-trust/10 text-success-trust p-3.5 rounded-xl">
                <TrendingUp className="h-7 w-7" />
              </div>
            </div>

            {/* Card 3: Cartera Vigente */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
              <div className="space-y-1">
                <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Cartera en Nómina</span>
                <span className="block text-2xl font-black text-primary-deep">{formatCurrency(12400000)}</span>
              </div>
              <div className="bg-primary-deep/5 text-primary-deep p-3.5 rounded-xl">
                <Briefcase className="h-7 w-7 text-primary-brand" />
              </div>
            </div>

            {/* Card 4: Siniestralidad */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
              <div className="space-y-1">
                <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Siniestralidad</span>
                <span className="block text-2xl font-black text-red-600">3.12%</span>
              </div>
              <div className="bg-red-50 text-red-600 p-3.5 rounded-xl">
                <ShieldAlert className="h-7 w-7" />
              </div>
            </div>
          </div>

          {/* Section: Charts & Auditing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Investment & Yield Charts (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Chart 1: Asset Allocation (Pie) */}
                <Card title="Distribución de Activos del Fondo">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Custom Legends */}
                  <div className="mt-4 space-y-2 text-xs">
                    {allocationData.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-neutral-dark">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.name}</span>
                        </div>
                        <span className="font-bold text-neutral-dark">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Chart 2: Annual yield evolution (Bar) */}
                <Card title="Histórico de Rendimiento Anual (%)">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yieldData}>
                        <XAxis dataKey="year" stroke="#5B6770" fontSize={11} fontStyle="normal" />
                        <YAxis stroke="#5B6770" fontSize={11} domain={[0, 10]} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="rendimiento" fill="#005B96" radius={[4, 4, 0, 0]}>
                          {yieldData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === yieldData.length - 1 ? '#00A878' : '#005B96'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-neutral-muted">
                      Rendimiento en constante crecimiento. 2026 proyectado a 8.45% por diversificación.
                    </span>
                  </div>
                </Card>

              </div>

              {/* Card de Predicciones y Riesgos Rius AI */}
              <Card 
                title={
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent-tech animate-pulse" />
                    <span>Predicciones y Riesgos Rius AI</span>
                  </div>
                }
                headerAction={
                  <span className="px-2.5 py-1 bg-success-trust/10 text-success-trust text-xxs font-extrabold rounded-full uppercase tracking-wider border border-success-trust/20 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success-trust animate-ping" />
                    Rius AI Engine Activo
                  </span>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {/* Probabilidad de Recuperación */}
                  <div className="p-5 bg-gray-50 border border-gray-150 rounded-2xl space-y-4">
                    <div>
                      <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Probabilidad de Recuperación</span>
                      <span className="text-3xl font-black text-success-trust block mt-1">94.2%</span>
                      <span className="text-xxs text-neutral-muted font-normal block mt-1">Tendencia de cobro mensual optimizada.</span>
                    </div>
                    <div className="relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-success-trust rounded-full" style={{ width: '94.2%' }} />
                    </div>
                  </div>

                  {/* Proyección del Fondo a 2027 */}
                  <div className="p-5 bg-gray-50 border border-gray-150 rounded-2xl space-y-4">
                    <div>
                      <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Proyección de Fondo a 2027</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-primary-deep">{formatCurrency(180000000)}</span>
                        <span className="text-xs font-bold text-success-trust flex items-center gap-0.5">
                          <TrendingUp className="h-3.5 w-3.5" /> +16.2%
                        </span>
                      </div>
                      <span className="text-xxs text-neutral-muted font-normal block mt-1">Incremento por diversificación y aportes.</span>
                    </div>
                    <div className="relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-primary-brand rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>

                  {/* Perfil de Riesgos por Empresa */}
                  <div className="p-5 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider mb-3">Riesgo de Incumplimiento</span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-dark">Consorcio Red Uno</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-extrabold bg-amber-50 text-warning-alert border border-amber-200">
                            MEDIO (12%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-dark">Uninet</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-extrabold bg-success-trust/10 text-success-trust border border-success-trust/20">
                            BAJO (4%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-muted font-normal block border-t border-gray-200/60 pt-2 mt-2 leading-relaxed">
                      Modelos predictivos de riesgo corporativo.
                    </span>
                  </div>
                </div>
                
                {/* AI Recommendation Message */}
                <div className="mt-6 p-4 bg-primary-brand/5 border border-primary-brand/20 rounded-2xl text-xs flex gap-3 items-start">
                  <Brain className="h-5 w-5 text-primary-brand shrink-0 mt-0.5" />
                  <p className="text-neutral-dark leading-relaxed font-medium">
                    <span className="font-extrabold text-primary-deep">Recomendación Rius AI:</span> Se prevé que el fondo del fideicomiso mantenga un crecimiento sostenido del 6.2% anual. La tasa de recuperación de cartera se estabilizará en 94.2% debido a la optimización de los flujos de conciliación automatizados de Uninet y Consorcio Red Uno. El riesgo de incumplimiento global se mantiene controlado en un nivel de 2.1%.
                  </p>
                </div>
              </Card>
            </div>

            {/* PwC Audit Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="border-t-8 border-t-primary-brand h-full">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-primary-deep flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success-trust" />
                      <span>Dictámenes de Auditoría</span>
                    </h3>
                    <p className="text-xs text-neutral-muted mt-1">Estatuto de transparencia y control externo.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Auditor firm */}
                    <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex gap-3 text-sm">
                      <Building className="h-5 w-5 text-primary-brand shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-primary-deep text-xs uppercase">Despacho Externo</span>
                        <span className="font-bold text-neutral-dark block mt-0.5">PricewaterhouseCoopers (PwC)</span>
                        <span className="text-xs text-neutral-muted block">Socio Firmante: C.P. Arturo Ramos</span>
                      </div>
                    </div>

                    {/* Opinion Status */}
                    <div className="p-4 bg-success-trust/10 border border-success-trust/30 rounded-2xl flex gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-success-trust shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-[#008f65] text-xs uppercase">Dictamen Reciente</span>
                        <span className="font-bold text-neutral-dark block mt-0.5">Limpio (Sin salvedades)</span>
                        <span className="text-xs text-neutral-muted block">Emitido al 31 de Diciembre de 2025</span>
                      </div>
                    </div>

                    {/* Auditing calendar */}
                    <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex gap-3 text-sm">
                      <Calendar className="h-5 w-5 text-primary-brand shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-primary-deep text-xs uppercase">Próximos Hitos</span>
                        <div className="mt-2 space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-neutral-muted">Auditoría Interna Q2:</span>
                            <span className="font-bold text-neutral-dark">15 Jun 2026</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-muted">Pre-auditoría PwC:</span>
                            <span className="font-bold text-neutral-dark">10 Oct 2026</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Centro de Reportes Oficiales */}
              <Card 
                title={
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary-brand" />
                    <span>Reportes Oficiales</span>
                  </div>
                }
              >
                <p className="text-xs text-neutral-muted -mt-3 mb-6">Descarga de estados de cuenta y conciliaciones oficiales con firma digital.</p>
                
                <div className="space-y-4">
                  {/* Reporte 1 */}
                  <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary-brand shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-neutral-dark block text-xs">Edo. Cuenta Consolidado</span>
                        <span className="text-[10px] text-neutral-muted block">Balanza oficial de activos (PDF)</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleGenerateReport('PDF', 'Estado de Cuenta Consolidado')}
                      className="p-2 bg-primary-brand/5 hover:bg-primary-brand/10 text-primary-brand border border-primary-brand/10 rounded-xl transition-colors cursor-pointer flex items-center justify-center min-h-0"
                      aria-label="Descargar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Reporte 2 */}
                  <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-start gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-success-trust shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-neutral-dark block text-xs">Auxiliar de Conciliación</span>
                        <span className="text-[10px] text-neutral-muted block">Detalle mensual (Excel)</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleGenerateReport('Excel', 'Auxiliar de Conciliación Mensual')}
                      className="p-2 bg-success-trust/10 hover:bg-success-trust/20 text-success-trust border border-success-trust/20 rounded-xl transition-colors cursor-pointer flex items-center justify-center min-h-0"
                      aria-label="Descargar Excel"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Reporte 3 */}
                  <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-start gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-success-trust shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-neutral-dark block text-xs">Aportaciones Patronales</span>
                        <span className="text-[10px] text-neutral-muted block">Historial crudo (Excel)</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleGenerateReport('Excel_Aportaciones', 'Reporte Histórico de Aportaciones')}
                      className="p-2 bg-success-trust/10 hover:bg-success-trust/20 text-success-trust border border-success-trust/20 rounded-xl transition-colors cursor-pointer flex items-center justify-center min-h-0"
                      aria-label="Descargar Excel"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>

          </div>

        </main>
      </div>

      {/* Modal: Report Generation Progress */}
      {reportState.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
            {/* Header */}
            <div className="bg-primary-deep text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent-tech" />
                <span>Generando Reporte Seguro</span>
              </h3>
              {!reportState.isCompleted && (
                <span className="text-xxs px-2.5 py-1 bg-amber-500/20 text-amber-300 font-extrabold rounded-full uppercase tracking-wider animate-pulse">
                  Firmando...
                </span>
              )}
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6 text-left">
              <div className="bg-neutral-bg p-4 rounded-xl border border-gray-250">
                <span className="block text-xs font-bold text-neutral-muted uppercase">Tipo de Documento</span>
                <span className="block text-lg font-bold text-primary-deep">{reportState.name}</span>
                <span className="block text-xs text-neutral-muted mt-1">Formato: {reportState.type}</span>
              </div>

              {/* Progress and status */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-dark font-bold">{reportState.status}</span>
                  <span className="text-primary-brand font-black">{reportState.progress}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-brand rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${reportState.progress}%` }} 
                  />
                </div>

                {/* Secure audit console */}
                <div className="p-3 bg-gray-900 rounded-xl font-mono text-xxs text-green-400 space-y-1 select-none overflow-hidden max-h-[100px] overflow-y-auto border border-gray-800">
                  <p className="text-gray-500">[{new Date().toLocaleTimeString()}] Inicializando clave pública...</p>
                  {reportState.progress >= 25 && <p className="text-green-500">✓ Conectado a Servidor de Sellos Telmex</p>}
                  {reportState.progress >= 50 && <p className="text-green-500">✓ Hash de Datos: SHA-256 verificado</p>}
                  {reportState.progress >= 75 && <p className="text-green-400 font-bold">✓ Firma FIEL generada con éxito</p>}
                  {reportState.progress >= 100 && (
                    <>
                      <p className="text-success-trust font-extrabold">✓ Transacción firmada: ok</p>
                      <p className="text-gray-400 truncate">Sello: d41d8cd98f00b204e9800998ecf8427e</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-150">
              <button
                disabled={!reportState.isCompleted}
                className="py-2.5 px-6 rounded-xl font-bold text-sm bg-primary-brand text-white shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all cursor-pointer flex items-center justify-center min-h-0"
                onClick={() => setReportState(prev => ({ ...prev, isOpen: false }))}
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
