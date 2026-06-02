import React, { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';
import { Users, FileText, Building2, AlertTriangle, FileSpreadsheet, Download, RefreshCw, CheckCircle2, XCircle, AlertCircle, TrendingUp, Clock, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminHeader from '../components/layout/AdminHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ADMIN_STATS, SYSTEM_ALERTS, RECENT_TRAMITES } from '../data/mockData';

export default function AdminDashboard() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '¡Hola! Soy Copilot Rius AI. ¿En qué puedo ayudarte hoy a analizar el fideicomiso?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'Lo siento, no tengo esa información disponible en este momento. Pregúntame sobre los trámites rechazados, inconsistencias o el monto recuperado de este mes.';
      
      const cleanText = text.toLowerCase();
      if (cleanText.includes('rechazado') || cleanText.includes('trámites rechazados')) {
        reply = 'Actualmente en el sistema hay **2 trámites con estatus de Rechazado**. El último corresponde a la solicitud de recuperación de cuotas de Consorcio Red Uno.';
      } else if (cleanText.includes('inconsistencia') || cleanText.includes('empresa')) {
        reply = 'La empresa con mayor índice de inconsistencias este mes es **Consorcio Red Uno** (Diferencia de -$500.00 pesos en arqueo contable) y **Uno TV** (3 registros con inconsistencias de CURP por cambio de apellidos).';
      } else if (cleanText.includes('monto recuperado') || cleanText.includes('este mes') || cleanText.includes('recuperado')) {
        reply = 'El monto total recuperado de aportaciones este mes asciende a **$4,580,000 MXN**, con una eficiencia operativa del 98.4%.';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 1000);
  };
  
  const formatCurrency = (value) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aprobado':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-trust/15 text-success-trust border border-success-trust/20">✓ Aprobado</span>;
      case 'Pendiente':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-150 text-gray-500 border border-gray-250">● Pendiente</span>;
      case 'En Revisión':
      case 'En Validación':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning-alert/15 text-warning-alert border border-warning-alert/25">⌛ {status}</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  const handleExport = async (type) => {
    toast.info(`Generando exportación a ${type}...`);
    
    try {
      if (type === 'Reporte PDF') {
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

        // Table Header
        doc.setFontSize(12);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(0, 59, 92);
        doc.text("DISTRIBUCIÓN DE ACTIVOS", 14, 115);

        doc.setFillColor(0, 59, 92);
        doc.rect(14, 120, 182, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('Helvetica', 'bold');
        doc.text("Clase de Activo", 18, 125);
        doc.text("Porcentaje", 120, 125);
        doc.text("Monto Estimado (MXN)", 150, 125);

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

        // Seals
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

        doc.save("Reporte_Financiero_Empresas_FIRMADO.pdf");
        toast.success("Reporte PDF generado y descargado con éxito.");
      } else if (type === 'Excel') {
        // Padrón Consolidado de Asociados
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Rius AI Engine';
        const ws = workbook.addWorksheet('Asociados Consolidado');
        ws.views = [{ showGridLines: true }];

        ws.columns = [
          { header: 'ID Asociado', key: 'id', width: 15 },
          { header: 'Nombre del Asociado', key: 'name', width: 30 },
          { header: 'Empresa Depositaria', key: 'company', width: 45 },
          { header: 'Edad', key: 'age', width: 10 },
          { header: 'Acumulado Cuotas (MXN)', key: 'cuotas', width: 25 },
          { header: 'Estatus', key: 'status', width: 15 }
        ];

        const mockAssociates = [
          { id: "902847", name: "Eduardo Rius Torres", company: "TELNOR (Telégrafos y Teléfonos del Noroeste, S.A. de C.V.)", age: 66, cuotas: 85420.00, status: "Vigente" },
          { id: "103984", name: "Carlos Mendoza", company: "TELMEX (Teléfonos de México, S.A.B. de C.V.)", age: 64, cuotas: 98200.00, status: "Vigente" },
          { id: "284719", name: "Juan Manuel López", company: "Red Uno S.A. de C.V.", age: 65, cuotas: 92400.00, status: "Vigente" },
          { id: "748392", name: "Silvia Martínez", company: "Triara (Vance Asesoría de Negocios, S.A. de C.V.)", age: 63, cuotas: 78500.00, status: "Vigente" },
          { id: "582910", name: "Teresa Sánchez", company: "Telvista S.A. de C.V.", age: 61, cuotas: 62000.00, status: "Vigente" },
          { id: "482019", name: "Raúl García", company: "Scitum S.A. de C.V.", age: 67, cuotas: 110400.00, status: "Vigente" },
          { id: "389201", name: "Carmen Ortiz", company: "Editorial Telmex", age: 65, cuotas: 54100.00, status: "Vigente" }
        ];

        mockAssociates.forEach(item => {
          ws.addRow({
            id: item.id,
            name: item.name,
            company: item.company,
            age: item.age,
            cuotas: item.cuotas,
            status: item.status
          });
        });

        const headerRow = ws.getRow(1);
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
          cell.font = { name: 'Calibri', bold: true, color: { argb: 'FFFFFF' } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '003B5C' }
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        ws.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            row.height = 20;
            row.getCell(5).numFormat = '$#,##0.00';
            row.getCell(5).alignment = { horizontal: 'right' };
            row.getCell(1).alignment = { horizontal: 'center' };
            row.getCell(4).alignment = { horizontal: 'center' };
            row.getCell(6).alignment = { horizontal: 'center' };
            row.getCell(6).font = { color: { argb: '008F65' }, bold: true };
            
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
        a.download = `Padron_Consolidado_Asociados.xlsx`;
        a.addEventListener('click', (e) => e.stopPropagation());
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);

        toast.success("Excel Consolidado de Asociados descargado con éxito.");
      } else if (type === 'Arqueo Consolidado') {
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
            row.getCell(4).numFormat = '$#,##0.00';
            row.getCell(4).alignment = { horizontal: 'right' };
            row.getCell(3).numFormat = '#,##0';
            row.getCell(3).alignment = { horizontal: 'right' };
            row.getCell(2).alignment = { horizontal: 'center' };
            row.getCell(5).alignment = { horizontal: 'center' };
            
            const statusText = row.getCell(5).value;
            if (statusText === 'RECIBIDO') {
              row.getCell(5).font = { color: { argb: '008F65' }, bold: true };
            } else if (statusText === 'INCONSISTENTE') {
              row.getCell(5).font = { color: { argb: 'D9383A' }, bold: true };
            } else {
              row.getCell(5).font = { color: { argb: '707070' }, italic: true };
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
        a.download = `Arqueo_Consolidado_Fideicomiso.xlsx`;
        a.addEventListener('click', (e) => e.stopPropagation());
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);

        toast.success("Arqueo Consolidado descargado con éxito.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al exportar los datos reales.");
    }
  };

  return (
    <div className="flex bg-neutral-bg min-h-screen">
      {/* Admin Left Sidebar */}
      <AdminSidebar />

      {/* Main Administrative Panel (Right Content) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8 text-left">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-primary-deep tracking-tight">Consola de Control de Fideicomiso</h2>
              <p className="text-base text-neutral-muted mt-1">Resumen general del estado de asociados, aportaciones de empresas y trámites vigentes.</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 py-2.5 px-4 text-base"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar Datos</span>
            </Button>
          </div>

        {/* KPI Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Card 1: Active Associates */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Asociados Activos</span>
              <span className="block text-3xl font-black text-primary-deep">{ADMIN_STATS.activeAssociates.toLocaleString()}</span>
            </div>
            <div className="bg-primary-brand/10 text-primary-brand p-3.5 rounded-xl">
              <Users className="h-7 w-7" />
            </div>
          </div>

          {/* Card 2: Pending Files */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Trámites Pendientes</span>
              <span className="block text-3xl font-black text-warning-alert">{ADMIN_STATS.pendingTramitesCount}</span>
            </div>
            <div className="bg-warning-alert/15 text-warning-alert p-3.5 rounded-xl">
              <FileText className="h-7 w-7" />
            </div>
          </div>

          {/* Card 3: Company Files Uploaded */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Empresas Recibidas</span>
              <span className="block text-3xl font-black text-primary-brand">
                {ADMIN_STATS.companiesSubmitted} / {ADMIN_STATS.totalCompanies}
              </span>
            </div>
            <div className="bg-primary-brand/10 text-primary-brand p-3.5 rounded-xl">
              <Building2 className="h-7 w-7" />
            </div>
          </div>

          {/* Card 4: Inconsistency Count */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Inconsistencias</span>
              <span className="block text-3xl font-black text-red-650 text-red-600">{ADMIN_STATS.inconsistenciesCount}</span>
            </div>
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl">
              <AlertTriangle className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* KPI Panel Row 2 (Dashboard Ejecutivo) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 5: Monto Recuperado */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Monto Recuperado</span>
              <span className="block text-3xl font-black text-primary-deep">$4,580,000</span>
            </div>
            <div className="bg-success-trust/10 text-success-trust p-3.5 rounded-xl">
              <TrendingUp className="h-7 w-7" />
            </div>
          </div>

          {/* Card 6: Monto Entregado */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Monto Entregado</span>
              <span className="block text-3xl font-black text-primary-brand">$1,240,000</span>
            </div>
            <div className="bg-primary-brand/10 text-primary-brand p-3.5 rounded-xl">
              <Download className="h-7 w-7" />
            </div>
          </div>

          {/* Card 7: Tiempo Promedio */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Tiempo Promedio</span>
              <span className="block text-3xl font-black text-primary-deep">2.3 días</span>
            </div>
            <div className="bg-primary-deep/5 text-primary-deep p-3.5 rounded-xl">
              <Clock className="h-7 w-7 text-primary-brand" />
            </div>
          </div>

          {/* Card 8: Eficiencia Operativa */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between transition-all duration-300 ease hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Eficiencia Operativa</span>
              <span className="block text-3xl font-black text-success-trust">98.4%</span>
            </div>
            <div className="bg-success-trust/10 text-success-trust p-3.5 rounded-xl">
              <ShieldCheck className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Charts Panel (Tarea 1) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Card: Aportaciones */}
          <div className="md:col-span-8">
            <Card title="Evolución Mensual de Aportaciones">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: 'Ene', aportes: 1200000 },
                    { month: 'Feb', aportes: 1350000 },
                    { month: 'Mar', aportes: 1500000 },
                    { month: 'Abr', aportes: 1800000 },
                    { month: 'May', aportes: 2150000 }
                  ]}>
                    <defs>
                      <linearGradient id="colorAportes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005B96" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#005B96" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#5B6770" fontSize={11} tickLine={false} />
                    <YAxis stroke="#5B6770" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000000}M`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="aportes" stroke="#005B96" strokeWidth={3} fillOpacity={1} fill="url(#colorAportes)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Card: Trámites por Estado */}
          <div className="md:col-span-4">
            <Card title="Trámites por Estado">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Aprobado', value: 6, color: '#00A878' },
                        { name: 'Pendiente', value: 3, color: '#F6A623' },
                        { name: 'En Revisión', value: 2, color: '#005B96' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {[
                        { color: '#00A878' },
                        { color: '#F6A623' },
                        { color: '#005B96' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold text-neutral-dark mt-2">
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success-trust" />Aprobados (6)</div>
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning-alert" />Pendientes (3)</div>
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary-brand" />En Revisión (2)</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols): Recent Procedures & Export */}
          <div className="lg:col-span-8 space-y-8">
            {/* Card: Recent Procedures Table */}
            <Card
              title="Solicitudes Recientes de Asociados"
              headerAction={
                <Link to="/admin/tramites" className="text-primary-brand hover:text-primary-deep text-base font-bold flex items-center gap-1.5 focus-visible:outline-none">
                  Ver todos los trámites →
                </Link>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">ID</th>
                      <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Asociado</th>
                      <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Tipo Trámite</th>
                      <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Importe</th>
                      <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Estatus</th>
                      <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_TRAMITES.slice(0, 6).map((t, i) => (
                      <tr key={i} className="border-b border-gray-150 hover:bg-gray-50/50">
                        <td className="py-3 text-sm font-bold text-neutral-muted">{t.id}</td>
                        <td className="py-3 text-base font-bold text-neutral-dark">{t.name}</td>
                        <td className="py-3 text-base text-neutral-dark">{t.type}</td>
                        <td className="py-3 text-base font-bold text-neutral-dark">{formatCurrency(t.amount)}</td>
                        <td className="py-3 text-base">{getStatusBadge(t.status)}</td>
                        <td className="py-3 text-sm text-neutral-muted">{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Card: Export and Actions Modules */}
            <Card title="Acciones y Reportes de Fideicomiso">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 border border-gray-200 rounded-2xl flex flex-col justify-between items-start gap-4">
                  <div className="bg-primary-deep/5 p-3 rounded-xl text-primary-deep">
                    <FileSpreadsheet className="h-6 w-6 text-primary-brand" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-lg leading-tight">Exportar Excel Consolidado</h4>
                    <p className="text-xs text-neutral-muted mt-1">Descarga el padrón completo de asociados con sus montos acumulados.</p>
                  </div>
                  <Button variant="secondary" onClick={() => handleExport('Excel')} className="w-full text-sm py-2 px-3">
                    <Download className="h-4 w-4 mr-1.5" /> Exportar a Excel
                  </Button>
                </div>

                <div className="p-5 border border-gray-200 rounded-2xl flex flex-col justify-between items-start gap-4">
                  <div className="bg-primary-deep/5 p-3 rounded-xl text-primary-deep">
                    <FileText className="h-6 w-6 text-primary-brand" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-lg leading-tight">Reporte por Empresa</h4>
                    <p className="text-xs text-neutral-muted mt-1">Genera reportes PDF detallados con el arqueo financiero por empresa del grupo.</p>
                  </div>
                  <Button variant="secondary" onClick={() => handleExport('Reporte PDF')} className="w-full text-sm py-2 px-3">
                    <Download className="h-4 w-4 mr-1.5" /> Descargar Reportes
                  </Button>
                </div>

                <div className="p-5 border border-gray-200 rounded-2xl flex flex-col justify-between items-start gap-4">
                  <div className="bg-primary-deep/5 p-3 rounded-xl text-primary-deep">
                    <CheckCircle2 className="h-6 w-6 text-success-trust" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-lg leading-tight">Arqueo Consolidado</h4>
                    <p className="text-xs text-neutral-muted mt-1">Cierre mensual contable con conciliación de pólizas de la aseguradora.</p>
                  </div>
                  <Button variant="primary" onClick={() => handleExport('Arqueo Consolidado')} className="w-full text-sm py-2 px-3">
                    Generar Cierre
                  </Button>
                </div>
              </div>
            </Card>

          </div>

          {/* Right Column (4 cols): Automated System Alerts & Copilot */}
          <div className="lg:col-span-4 space-y-8">
            {/* Card: Copilot Rius AI (Tarea 5) */}
            <Card className="border-t-8 border-t-primary-brand bg-white relative overflow-hidden transition-all duration-300 ease hover:shadow-md hover:scale-[1.01]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-left">
                  <div className="p-2 bg-primary-deep/5 text-primary-brand rounded-xl">
                    <span className="text-xl" role="img" aria-label="brain">🧠</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-primary-deep leading-tight">Pregúntale a Rius AI</h3>
                    <p className="text-xxs text-neutral-muted uppercase tracking-wider font-bold">Copilot del Fideicomiso</p>
                  </div>
                </div>

                {/* Chat Message Window */}
                <div className="h-[220px] overflow-y-auto border border-gray-150 rounded-xl p-3 bg-gray-50/50 space-y-3 flex flex-col text-xs">
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`max-w-[85%] rounded-2xl p-2.5 leading-relaxed text-left ${
                        msg.sender === 'user' 
                          ? 'bg-primary-brand text-white self-end' 
                          : 'bg-white text-neutral-dark border border-gray-150 self-start'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="bg-white text-neutral-dark border border-gray-150 self-start p-3 rounded-2xl max-w-[85%] flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-neutral-muted rounded-full animate-bounce" />
                      <span className="h-1.5 w-1.5 bg-neutral-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 bg-neutral-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>

                {/* Suggestion Pills */}
                <div className="flex flex-col gap-1.5 text-left">
                  {[
                    '¿Cuántos trámites rechazados tengo?',
                    '¿Qué empresa tiene más inconsistencias?',
                    '¿Cuál es el monto recuperado este mes?'
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] font-bold text-primary-brand bg-primary-brand/5 hover:bg-primary-brand/10 border border-primary-brand/10 px-2.5 py-1.5 rounded-lg text-left transition-colors focus-visible:outline-none cursor-pointer leading-normal"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Chat Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Escribe tu consulta..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:border-primary-brand focus-visible:outline-none min-h-[38px]"
                  />
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="py-1 px-3.5 text-xs min-h-[38px] font-bold shrink-0"
                  >
                    Enviar
                  </Button>
                </form>
              </div>
            </Card>

            <Card className="border-t-8 border-t-red-500">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-primary-deep flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-650 text-red-500" />
                    <span>Alertas de Conciliación</span>
                  </h3>
                  <p className="text-xs text-neutral-muted mt-1">Generadas automáticamente al cruzar aportaciones de nómina vs padrón.</p>
                </div>

                <div className="space-y-4">
                  {SYSTEM_ALERTS.map((alert) => {
                    const isError = alert.type === 'error';
                    const isWarning = alert.type === 'warning';
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-xl border flex gap-3 text-sm ${
                          isError
                            ? 'bg-red-50/50 border-red-200 text-red-950'
                            : isWarning
                            ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                            : 'bg-blue-50/50 border-blue-200 text-blue-950'
                        }`}
                      >
                        {isError ? (
                          <XCircle className="h-5 w-5 text-red-650 text-red-500 shrink-0 mt-0.5" />
                        ) : isWarning ? (
                          <AlertTriangle className="h-5 w-5 text-warning-alert shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-accent-tech shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <p className="font-semibold leading-relaxed">{alert.message}</p>
                          <span className="block text-xxs text-neutral-muted">{alert.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

        </div>
      </main>
      </div>
    </div>
  );
}
