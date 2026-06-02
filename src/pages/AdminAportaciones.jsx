import React, { useState } from 'react';
import { toast } from 'sonner';
import ExcelJS from 'exceljs';
import { Upload, Search, Filter, ShieldAlert, CheckCircle2, AlertTriangle, X, Download, FileText, Send, Sparkles } from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminHeader from '../components/layout/AdminHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { COMPANY_CONTRIBUTIONS } from '../data/mockData';

export default function AdminAportaciones() {
  // Main states
  const [contributions, setContributions] = useState(COMPANY_CONTRIBUTIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  // Modals visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [selectedDiffCompany, setSelectedDiffCompany] = useState('');
  
  // Interactive Demo States
  const [remindersSent, setRemindersSent] = useState({
    Uninet: false,
    ClaroVideo: false,
    Sanborns: false
  });
  const [resolvedInconsistencies, setResolvedInconsistencies] = useState({
    ConsorcioRedUno: false,
    UnoTV: false
  });
  const [globalReconciliationStatus, setGlobalReconciliationStatus] = useState('pendiente'); // 'pendiente', 'procesando', 'conciliado'

  // Upload modal fields
  const [uploadCompany, setUploadCompany] = useState('');
  const [uploadPeriod, setUploadPeriod] = useState('Mayo 2026');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);

  // Formatting helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  const getStatusBadge = (status, companyName) => {
    let currentStatus = status;
    if (companyName === 'Consorcio Red Uno' && resolvedInconsistencies.ConsorcioRedUno) {
      currentStatus = 'recibido';
    } else if (companyName === 'Uno TV' && resolvedInconsistencies.UnoTV) {
      currentStatus = 'recibido';
    }

    const configs = {
      recibido: { text: '✓ Recibido', classes: 'bg-success-trust/10 text-success-trust border-success-trust/20' },
      pendiente: { text: '● Pendiente', classes: 'bg-gray-150 text-gray-550 border border-gray-250' },
      inconsistente: { text: '⚠ Inconsistencia', classes: 'bg-red-50 text-red-660 text-red-600 border-red-200' }
    };

    const config = configs[currentStatus] || { text: currentStatus, classes: 'bg-gray-150 text-gray-800 border-gray-250' };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${config.classes}`}>
        {config.text}
      </span>
    );
  };

  // Process contributions with active resolutions
  const getProcessedContributions = () => {
    return contributions.map(c => {
      if (c.company.includes('Consorcio Red Uno') && resolvedInconsistencies.ConsorcioRedUno) {
        return { ...c, status: 'recibido', records: 120, total: 27600.00 };
      }
      if (c.company.includes('Uno TV') && resolvedInconsistencies.UnoTV) {
        return { ...c, status: 'recibido', records: 45, total: 10350.00 };
      }
      return c;
    });
  };

  const filteredContributions = getProcessedContributions().filter(item => {
    const matchesSearch = item.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Action Handlers
  const sendReminder = (companyKey, companyName) => {
    setRemindersSent(prev => ({ ...prev, [companyKey]: true }));
    toast.success(`Recordatorio enviado con éxito al departamento de Recursos Humanos de ${companyName}.`);
  };

  const openResolveDiff = (companyName) => {
    setSelectedDiffCompany(companyName);
    setIsDiffModalOpen(true);
  };

  const resolveDiff = () => {
    const companyKey = selectedDiffCompany.includes('Consorcio') ? 'ConsorcioRedUno' : 'UnoTV';
    setResolvedInconsistencies(prev => ({ ...prev, [companyKey]: true }));
    setIsDiffModalOpen(false);
    toast.success(`Se ha conciliado manualmente la diferencia para ${selectedDiffCompany} mediante ajuste de arqueo compensatorio.`);
  };

  const runGlobalReconciliation = () => {
    setGlobalReconciliationStatus('procesando');
    setTimeout(() => {
      setGlobalReconciliationStatus('conciliado');
      toast.success("Periodo conciliado al 100%");
    }, 2000);
  };

  const handleFileUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file.name);
    }
  };

  const handleProcessUpload = (e) => {
    e.preventDefault();
    if (!uploadCompany || !uploadFile) {
      toast.error('Por favor seleccione una empresa y cargue su archivo.');
      return;
    }

    const updated = contributions.map(item => {
      if (item.company === uploadCompany) {
        return {
          ...item,
          date: new Date().toLocaleDateString('es-MX'),
          records: 180,
          total: 41400.00,
          status: 'recibido'
        };
      }
      return item;
    });

    setContributions(updated);
    setUploadMessage({
      type: 'success',
      text: `El archivo contable de aportaciones voluntarias para la empresa ${uploadCompany} fue procesado e ingresado de forma automática: 180 registros conciliados exitosamente.`
    });
    
    setTimeout(() => {
      setIsModalOpen(false);
      setUploadFile(null);
      setUploadCompany('');
      setUploadMessage(null);
    }, 2500);
  };

  const exportExcelSimulate = async () => {
    toast.info('Generando archivo Excel del arqueo de aportaciones de Mayo 2026...');
    
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Rius AI Engine';
      workbook.lastModifiedBy = 'Fideicomiso Admin';
      workbook.created = new Date();
      workbook.modified = new Date();

      // Tab 1: Resumen
      const wsResumen = workbook.addWorksheet('Resumen de Arqueo');
      wsResumen.views = [{ showGridLines: true }];

      // Title
      wsResumen.mergeCells('A1:F2');
      const titleCell = wsResumen.getCell('A1');
      titleCell.value = 'Arqueo de Aportaciones de Empresas';
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

      wsResumen.getCell('A5').value = 'Fecha de Exportación:';
      wsResumen.getCell('A5').font = { bold: true };
      wsResumen.getCell('B5').value = new Date().toLocaleDateString('es-MX');

      // KPIs
      const activeContributions = filteredContributions;
      const totalRecaudado = activeContributions
        .filter(c => c.status === 'recibido' || c.status === 'inconsistente')
        .reduce((acc, curr) => acc + curr.total, 0);

      wsResumen.mergeCells('B8:C8');
      wsResumen.getCell('B8').value = 'TOTAL RECAUDADO (MXN)';
      wsResumen.getCell('B8').font = { size: 9, bold: true, color: { argb: '5B6770' } };
      wsResumen.getCell('B8').alignment = { horizontal: 'center' };

      wsResumen.mergeCells('B9:C10');
      wsResumen.getCell('B9').value = totalRecaudado;
      wsResumen.getCell('B9').font = { size: 16, bold: true, color: { argb: '003B5C' } };
      wsResumen.getCell('B9').numFormat = '$#,##0.00';
      wsResumen.getCell('B9').alignment = { vertical: 'middle', horizontal: 'center' };

      wsResumen.mergeCells('E8:F8');
      wsResumen.getCell('E8').value = 'EMPRESAS REPORTADAS';
      wsResumen.getCell('E8').font = { size: 9, bold: true, color: { argb: '5B6770' } };
      wsResumen.getCell('E8').alignment = { horizontal: 'center' };

      const numReportadas = activeContributions.filter(c => c.status === 'recibido').length;
      wsResumen.mergeCells('E9:F10');
      wsResumen.getCell('E9').value = `${numReportadas} / ${activeContributions.length}`;
      wsResumen.getCell('E9').font = { size: 16, bold: true, color: { argb: '005B96' } };
      wsResumen.getCell('E9').alignment = { vertical: 'middle', horizontal: 'center' };

      const cardBorder = {
        top: { style: 'thin', color: { argb: 'D3D3D3' } },
        left: { style: 'thin', color: { argb: 'D3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'D3D3D3' } },
        right: { style: 'thin', color: { argb: 'D3D3D3' } }
      };
      for(let r=8; r<=10; r++) {
        for(let c=2; c<=3; c++) wsResumen.getCell(r, c).border = cardBorder;
        for(let c=5; c<=6; c++) wsResumen.getCell(r, c).border = cardBorder;
      }

      // Tab 2: Detalle
      const wsDetalle = workbook.addWorksheet('Detalle de Aportaciones');
      wsDetalle.views = [{ showGridLines: true }];

      wsDetalle.columns = [
        { header: 'Razón Social de la Empresa', key: 'company', width: 45 },
        { header: 'Fecha Carga', key: 'date', width: 15 },
        { header: 'Registros', key: 'records', width: 12 },
        { header: 'Importe Recibido (MXN)', key: 'total', width: 22 },
        { header: 'Estatus Conciliación', key: 'status', width: 20 }
      ];

      activeContributions.forEach(c => {
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

      const totalRowNumber = activeContributions.length + 2;
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
      a.download = `Arqueo_Aportaciones_Mayo_2026.xlsx`;
      a.addEventListener('click', (e) => e.stopPropagation());
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success('Archivo Excel generado y descargado con éxito.');
    } catch (err) {
      console.error(err);
      toast.error('Error al generar el archivo Excel.');
    }
  };

  return (
    <div className="flex bg-neutral-bg min-h-screen">
      {/* Sidebar navigation */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8 text-left">
        
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 w-1/2 h-80 bg-gradient-to-b from-primary-brand/5 to-transparent pointer-events-none -z-10 rounded-bl-[100px]" />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-primary-deep tracking-tight">Archivo y Aportaciones por Empresa</h2>
            <p className="text-base text-neutral-muted mt-1">
              Corazón de la plataforma: Control, validación automática y arqueo bancario de las 15 empresas del grupo.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={exportExcelSimulate}
              className="flex items-center gap-2 py-2.5 px-4 text-base"
            >
              <Download className="h-4 w-4" />
              <span>Exportar Excel</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 py-2.5 px-5 text-base"
            >
              <Upload className="h-4 w-4" />
              <span>Cargar Archivo</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl border border-gray-250 p-6 shadow-sm">
            <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Total Recaudado</span>
            <span className="block text-3xl font-black text-primary-deep mt-1">
              {formatCurrency(
                filteredContributions
                  .filter(c => c.status === 'recibido' || c.status === 'inconsistente')
                  .reduce((acc, curr) => acc + curr.total, 0)
              )}
            </span>
            <span className="block text-xs text-success-trust font-bold mt-1">✓ Fideicomiso conciliado</span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-250 p-6 shadow-sm">
            <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Empresas Reportadas</span>
            <span className="block text-3xl font-black text-primary-brand mt-1">
              {contributions.filter(c => c.status === 'recibido' || (c.company.includes('Consorcio') && resolvedInconsistencies.ConsorcioRedUno) || (c.company.includes('Uno TV') && resolvedInconsistencies.UnoTV)).length} / 15
            </span>
            <span className="block text-xs text-neutral-muted mt-1">Corte actual del periodo</span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-250 p-6 shadow-sm">
            <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Inconsistencias Detectadas</span>
            <span className={`block text-3xl font-black mt-1 ${
              (resolvedInconsistencies.ConsorcioRedUno && resolvedInconsistencies.UnoTV) ? 'text-success-trust' : 'text-red-600'
            }`}>
              {2 - (resolvedInconsistencies.ConsorcioRedUno ? 1 : 0) - (resolvedInconsistencies.UnoTV ? 1 : 0)}
            </span>
            <span className="block text-xs text-neutral-muted mt-1">Cruces de nómina fallidos</span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-250 p-6 shadow-sm">
            <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Archivos Pendientes</span>
            <span className="block text-3xl font-black text-warning-alert mt-1">
              {3 - (remindersSent.Uninet ? 1 : 0) - (remindersSent.ClaroVideo ? 1 : 0) - (remindersSent.Sanborns ? 1 : 0)}
            </span>
            <span className="block text-xs text-neutral-muted mt-1">Empresas sin envío de nómina</span>
          </div>
        </div>

        {/* Global Reconciliation Controller Card */}
        <Card className="mb-8 border-l-8 border-l-success-trust overflow-hidden relative">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-success-trust/10 text-[#008f65] text-xs font-black rounded-full uppercase tracking-wider">
                  Módulo Automatizado
                </span>
                <span className="text-sm font-bold text-neutral-muted">Periodo: Mayo 2026</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary-deep">Arqueo y Cierre Mensual Consolidado</h3>
              <p className="text-base text-neutral-muted leading-relaxed">
                Este sistema cruza de manera automática los registros de aportaciones contra los arqueos bancarios del fideicomiso e identifica desvíos o pólizas inactivas sin intervención manual.
              </p>
            </div>
            
            <div className="shrink-0 w-full lg:w-auto">
              {globalReconciliationStatus === 'pendiente' && (
                <Button variant="success" onClick={runGlobalReconciliation} className="w-full lg:w-auto gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Conciliar Periodo y Cerrar Arqueo</span>
                </Button>
              )}
              {globalReconciliationStatus === 'procesando' && (
                <div className="flex items-center justify-center gap-3 bg-warning-alert/10 border border-warning-alert/30 text-warning-alert px-6 py-3.5 rounded-2xl font-bold text-lg">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-warning-alert border-t-transparent" />
                  <span>Cruzando 7,400 registros...</span>
                </div>
              )}
              {globalReconciliationStatus === 'conciliado' && (
                <div className="bg-success-trust/10 border border-success-trust/30 text-success-trust px-6 py-3.5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-6 w-6 stroke-[2.5px]" />
                  <span>✓ Periodo Conciliado al 100%</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Real-time Alerts Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Card: Pending Files Alerts */}
          <Card title="Alertas de Archivos Pendientes">
            <div className="space-y-4">
              {/* Alert Uninet */}
              <div className="p-4 bg-gray-50 border border-gray-250 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-base">
                <div className="flex gap-3 items-start">
                  <div className="p-2.5 bg-warning-alert/15 text-warning-alert rounded-xl shrink-0 mt-0.5">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-primary-deep block">Uninet S.A. de C.V.</span>
                    <p className="text-sm text-neutral-muted">Fecha límite (25/05/2026) superada. Archivo de aportaciones no recibido.</p>
                  </div>
                </div>
                
                {remindersSent.Uninet ? (
                  <span className="text-success-trust font-bold text-sm bg-success-trust/10 border border-success-trust/20 px-3 py-1.5 rounded-xl shrink-0">
                    ✓ Enviado
                  </span>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => sendReminder('Uninet', 'Uninet S.A. de C.V.')}
                    className="py-2 px-3 text-sm min-h-0 shrink-0 font-bold gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Notificar</span>
                  </Button>
                )}
              </div>

              {/* Alert Claro Video */}
              <div className="p-4 bg-gray-50 border border-gray-250 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-base">
                <div className="flex gap-3 items-start">
                  <div className="p-2.5 bg-warning-alert/15 text-warning-alert rounded-xl shrink-0 mt-0.5">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-primary-deep block">Claro Video S.A. de C.V.</span>
                    <p className="text-sm text-neutral-muted">Sin recepción de archivo en el corte actual.</p>
                  </div>
                </div>

                {remindersSent.ClaroVideo ? (
                  <span className="text-success-trust font-bold text-sm bg-success-trust/10 border border-success-trust/20 px-3 py-1.5 rounded-xl shrink-0">
                    ✓ Enviado
                  </span>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => sendReminder('ClaroVideo', 'Claro Video S.A. de C.V.')}
                    className="py-2 px-3 text-sm min-h-0 shrink-0 font-bold gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Notificar</span>
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Card: Reconciliation Inconsistencies */}
          <Card title="Alertas de Conciliación e Inconsistencia">
            <div className="space-y-4">
              {/* Alert Consorcio Red Uno */}
              <div className="p-4 bg-red-50/50 border border-red-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-base">
                <div className="flex gap-3 items-start">
                  <div className="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0 mt-0.5">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="font-bold text-primary-deep block">Consorcio Red Uno</span>
                    <p className="text-sm text-neutral-muted">
                      {resolvedInconsistencies.ConsorcioRedUno 
                        ? 'Inconsistencia resuelta mediante abono compensatorio.'
                        : 'El archivo reporta $27,600.00 MXN pero el arqueo bancario registra $27,100.00 MXN (-$500.00 pesos).'}
                    </p>
                  </div>
                </div>

                {resolvedInconsistencies.ConsorcioRedUno ? (
                  <span className="text-success-trust font-bold text-sm bg-success-trust/10 border border-success-trust/20 px-3 py-1.5 rounded-xl shrink-0">
                    ✓ Resuelto
                  </span>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => openResolveDiff('Consorcio Red Uno')}
                    className="py-2 px-3 text-sm min-h-0 shrink-0 font-bold"
                  >
                    Resolver
                  </Button>
                )}
              </div>

              {/* Alert Uno TV */}
              <div className="p-4 bg-red-50/50 border border-red-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-base">
                <div className="flex gap-3 items-start">
                  <div className="p-2.5 bg-red-100 text-red-650 text-red-650/90 rounded-xl shrink-0 mt-0.5">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="font-bold text-primary-deep block">Uno TV</span>
                    <p className="text-sm text-neutral-muted">
                      {resolvedInconsistencies.UnoTV 
                        ? 'Diferencia resuelta. CURPs cruzados con éxito.'
                        : 'Archivo contiene 3 registros con nombres no coincidentes con el padrón histórico.'}
                    </p>
                  </div>
                </div>

                {resolvedInconsistencies.UnoTV ? (
                  <span className="text-success-trust font-bold text-sm bg-success-trust/10 border border-success-trust/20 px-3 py-1.5 rounded-xl shrink-0">
                    ✓ Resuelto
                  </span>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => openResolveDiff('Uno TV')}
                    className="py-2 px-3 text-sm min-h-0 shrink-0 font-bold"
                  >
                    Resolver
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Controls Row */}
        <Card className="mb-8 py-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Filtrar por razón social..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl text-base font-semibold focus:border-primary-brand focus:ring-1 focus:ring-primary-brand min-h-[44px]"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-5 w-5 text-neutral-muted hidden sm:block shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full sm:w-auto border-2 border-gray-300 rounded-xl px-4 py-2.5 text-base font-semibold bg-white min-h-[44px]"
              >
                <option value="todos">Todos los Estados</option>
                <option value="recibido">Recibido (Conciliado)</option>
                <option value="pendiente">Pendiente</option>
                <option value="inconsistente">Inconsistente</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Main Contributions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Razón Social de la Empresa</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Fecha Carga</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted text-right">Registros</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted text-right">Importe Recibido</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted text-center">Estatus Conciliación</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredContributions.map((c, i) => (
                  <tr key={i} className="border-b border-gray-150 hover:bg-gray-50/50">
                    <td className="py-4 text-base font-bold text-neutral-dark">{c.company}</td>
                    <td className="py-4 text-base text-neutral-muted">{c.date}</td>
                    <td className="py-4 text-base font-bold text-neutral-dark text-right">{c.records.toLocaleString()}</td>
                    <td className="py-4 text-base font-bold text-neutral-dark text-right">{formatCurrency(c.total)}</td>
                    <td className="py-4 text-center">{getStatusBadge(c.status, c.company)}</td>
                    <td className="py-4 text-center">
                      {c.status === 'inconsistente' && !resolvedInconsistencies[c.company.includes('Consorcio') ? 'ConsorcioRedUno' : 'UnoTV'] ? (
                        <button
                          onClick={() => openResolveDiff(c.company)}
                          className="text-primary-brand hover:underline font-bold text-base cursor-pointer"
                        >
                          Resolver
                        </button>
                      ) : c.status === 'pendiente' ? (
                        <button
                          onClick={() => sendReminder(c.company.includes('Uninet') ? 'Uninet' : c.company.includes('Claro') ? 'ClaroVideo' : 'Sanborns', c.company)}
                          className="text-warning-alert hover:underline font-bold text-base cursor-pointer"
                        >
                          Recordatorio
                        </button>
                      ) : (
                        <span className="text-gray-400 font-bold text-base">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredContributions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-lg font-semibold text-neutral-muted">
                      No se encontraron resultados para los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Modal: Resolve Differences (Interactive Action) */}
      {isDiffModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-250">
            <div className="bg-primary-deep text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-accent-tech" />
                <span>Auditar Conciliación Automática</span>
              </h3>
              <button 
                onClick={() => setIsDiffModalOpen(false)} 
                className="p-1 rounded-lg hover:bg-white/10 text-white focus-visible:outline-none cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-left">
              <h4 className="text-lg font-bold text-primary-deep">Diferencia en {selectedDiffCompany}</h4>
              
              {selectedDiffCompany && selectedDiffCompany.includes('Consorcio') ? (
                <div className="space-y-4">
                  <p className="text-base text-neutral-muted">
                    El sistema detectó que el total depositado en banco por Consorcio Red Uno fue de **$27,100.00 MXN**, pero el archivo de nómina reporta un acumulado de **$27,600.00 MXN** (Diferencia: -$500.00 pesos).
                  </p>
                  <div className="bg-neutral-bg p-4 rounded-xl border border-gray-200 space-y-2 text-sm">
                    <span className="block font-bold text-primary-deep uppercase">Análisis del Algoritmo Rius AI:</span>
                    <p className="text-neutral-muted">
                      La diferencia corresponde a un recargo por aportación tardía de 10 asociados. El banco cobró la comisión por separado. El archivo de nómina es correcto.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-base text-neutral-muted">
                    El sistema detectó 3 registros cuyas CURP cargadas no coinciden con las registradas históricamente en el padrón de asociados.
                  </p>
                  <div className="bg-neutral-bg p-4 rounded-xl border border-gray-250 space-y-2 text-sm">
                    <span className="block font-bold text-primary-deep uppercase">Análisis del Algoritmo Rius AI:</span>
                    <p className="text-neutral-muted">
                      Se detectaron 3 asociados con cambio de apellido por matrimonio civil. Las CURP fueron validadas ante RENAPO automáticamente y son correctas.
                    </p>
                  </div>
                </div>
              )}

              {/* Bloque Destacado AI Recomendación (Tarea 7) */}
              <div className="p-4 rounded-2xl bg-primary-brand/5 border border-primary-brand/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-deep uppercase tracking-wider flex items-center gap-1">
                    <span className="h-2 w-2 bg-success-trust rounded-full animate-pulse" />
                    Asistente de Inconsistencias Rius AI
                  </span>
                  <span className="text-xs font-black text-success-trust bg-success-trust/10 border border-success-trust/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Confianza: 96%
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block text-xs font-bold text-neutral-muted uppercase">Recomendación sugerida</span>
                  <p className="text-sm text-neutral-dark font-medium leading-relaxed">
                    "Se recomienda conciliar automáticamente ya que la diferencia corresponde a una comisión bancaria registrada fuera del archivo de nómina."
                  </p>
                </div>
              </div>

              <p className="text-sm text-neutral-muted italic">
                ¿Desea autorizar el cuadre y marcar esta aportación como Conciliada (Recibida)?
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-150">
              <Button
                variant="light"
                onClick={() => setIsDiffModalOpen(false)}
                className="py-2.5 px-4 text-base"
              >
                Cancelar
              </Button>
              <Button
                variant="success"
                onClick={resolveDiff}
                className="py-2.5 px-6 text-base"
              >
                Resolver y Conciliar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload Contributions */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-250">
            {/* Header */}
            <div className="bg-primary-deep text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Upload className="h-5 w-5 text-accent-tech" />
                <span>Ingesta de Archivo de Aportaciones</span>
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setUploadMessage(null); }} 
                className="p-1 rounded-lg hover:bg-white/10 text-white focus-visible:outline-none cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleProcessUpload} className="p-6 space-y-6 text-left">
              {uploadMessage ? (
                <div className={`p-4 rounded-xl border flex gap-3 text-base ${
                  uploadMessage.type === 'success' ? 'bg-success-trust/10 border-success-trust/30 text-[#008f65]' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <div>
                    <span className="block font-bold">Resumen de Carga</span>
                    <p className="text-base font-semibold leading-relaxed">{uploadMessage.text}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Select Company */}
                  <div className="space-y-2">
                    <label htmlFor="upload-company" className="block text-base font-bold text-neutral-dark">Empresa Depositaria</label>
                    <select
                      id="upload-company"
                      required
                      value={uploadCompany}
                      onChange={(e) => setUploadCompany(e.target.value)}
                      className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3.5 text-lg font-semibold bg-white"
                    >
                      <option value="">Seleccione la empresa</option>
                      {contributions.filter(c => c.status === 'pendiente').map((c, i) => (
                        <option key={i} value={c.company}>{c.company}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Period */}
                  <div className="space-y-2">
                    <label htmlFor="upload-period" className="block text-base font-bold text-neutral-dark">Periodo Contable</label>
                    <select
                      id="upload-period"
                      required
                      value={uploadPeriod}
                      onChange={(e) => setUploadPeriod(e.target.value)}
                      className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3.5 text-lg font-semibold bg-white"
                    >
                      <option value="Mayo 2026">Mayo 2026 (Periodo Actual)</option>
                      <option value="Abril 2026">Abril 2026</option>
                      <option value="Marzo 2026">Marzo 2026</option>
                    </select>
                  </div>

                  {/* Drag-and-drop */}
                  <div className="space-y-2">
                    <span className="block text-base font-bold text-neutral-dark">Cargar Archivo (.txt / .xlsx)</span>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                      <input
                        type="file"
                        accept=".txt,.xlsx,.xls,.csv"
                        required
                        onChange={handleFileUploadChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-base font-bold text-primary-brand">Seleccione o arrastre el archivo de nómina</span>
                        <span className="text-xs text-neutral-muted">Formatos aceptados: XLSX, TXT, CSV. Máximo 10MB.</span>
                      </div>
                    </div>
                    {uploadFile && (
                      <div className="p-3 bg-success-trust/10 text-[#008f65] border border-success-trust/20 rounded-xl flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span className="font-bold text-base">Archivo: {uploadFile}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Footer */}
              {!uploadMessage && (
                <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 flex justify-end gap-3 mt-8">
                  <Button
                    variant="light"
                    className="py-2.5 px-4 text-base"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="py-2.5 px-6 text-base"
                  >
                    Procesar y Conciliar
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
