import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Search, Filter, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Eye, Clock, X, FolderOpen, FileText, ExternalLink } from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminHeader from '../components/layout/AdminHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { RECENT_TRAMITES } from '../data/mockData';

const MOCK_HISTORIAL = {
  'TR-8492': [
    { date: '25/05/2026', user: 'Carlos Mendoza (Auditoría)', status: 'Recibido', notes: 'Documentación cargada por el asociado.' },
    { date: '26/05/2026', user: 'Ana Díaz (Control)', status: 'En Validación', notes: 'Validando vigencia de la carta firmada.' }
  ],
  'TR-3920': [
    { date: '29/05/2026', user: 'Ana Díaz (Fideicomiso)', status: 'Rechazado', notes: 'El máximo permitido es $90,000' },
    { date: '30/05/2026', user: 'Ana Díaz (Fideicomiso)', status: 'Reabierto', notes: 'Asociado presentó reconsideración y ajuste de póliza.' },
    { date: '31/05/2026', user: 'Ana Díaz (Fideicomiso)', status: 'Aprobado', notes: 'Monto ajustado validado en arqueo bancario.' }
  ],
  'TR-1082': [
    { date: '20/05/2026', user: 'Sistema Automático', status: 'Recibido', notes: 'Inscripción web recibida.' },
    { date: '22/05/2026', user: 'Roberto Gómez (Eventos)', status: 'Aprobado', notes: 'Cupo confirmado y talla de playera registrada.' }
  ]
};

const getHistorial = (tramiteId) => {
  return MOCK_HISTORIAL[tramiteId] || [
    { date: '30/05/2026', user: 'Sistema Automático', status: 'Recibido', notes: 'Expediente ingresado al buzón digital.' },
    { date: '31/05/2026', user: 'Auditor de Turno', status: 'En Revisión', notes: 'Inicio de dictamen técnico.' }
  ];
};

const getRiusAiAnalysis = (tramite) => {
  if (tramite.amount && tramite.amount > 80000) {
    return {
      risk: 'Alto',
      color: 'bg-red-50 text-red-600 border-red-200',
      text: 'Riesgo Alto',
      analysis: 'El importe solicitado supera en 18% el promedio histórico para este tipo de trámite. Se aconseja una auditoría exhaustiva del archivo de nómina y los comprobantes bancarios.'
    };
  } else if (tramite.status === 'En Revisión' || tramite.status === 'En Validación') {
    return {
      risk: 'Medio',
      color: 'bg-amber-50 text-warning-alert border-amber-200',
      text: 'Riesgo Medio',
      analysis: 'Se detectó que el comprobante de domicilio fue cargado en formato de imagen de baja resolución. Los demás documentos están en orden.'
    };
  } else {
    return {
      risk: 'Bajo',
      color: 'bg-success-trust/10 text-success-trust border-success-trust/20',
      text: 'Riesgo Bajo',
      analysis: 'El expediente cumple con todos los requisitos establecidos. Las firmas digitales coinciden plenamente con el padrón del fideicomiso.'
    };
  }
};

export default function AdminTramites() {
  const [tramites, setTramites] = useState(() => {
    const stored = localStorage.getItem('ayudatelmex_admin_tramites');
    if (stored) {
      return JSON.parse(stored);
    }
    const list = [...RECENT_TRAMITES];
    localStorage.setItem('ayudatelmex_admin_tramites', JSON.stringify(list));
    return list;
  });

  // Sync state between open windows or local edits
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('ayudatelmex_admin_tramites');
      if (stored) {
        setTramites(JSON.parse(stored));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  // Interactive Claim Review
  const [activeReview, setActiveReview] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeExpediente, setActiveExpediente] = useState(null);

  const formatCurrency = (value) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aprobado':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-success-trust/10 text-success-trust border border-success-trust/20">✓ Aprobado</span>;
      case 'Rechazado':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-red-55/10 text-red-650 text-red-650/90 border border-red-500/25 bg-red-50 text-red-600">✗ Rechazado</span>;
      case 'Pendiente':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-gray-150 text-gray-550 border border-gray-250">● Pendiente</span>;
      case 'En Revisión':
      case 'En Validación':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-warning-alert/10 text-warning-alert border border-warning-alert/25">⌛ {status}</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-150 text-gray-800">{status}</span>;
    }
  };

  // Filter logic
  const filteredTramites = tramites.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'todos' || t.type.includes(typeFilter);
    const matchesStatus = statusFilter === 'todos' || t.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAction = (status) => {
    if (status === 'Rechazado' && !rejectReason) {
      toast.warning('Por favor describa el motivo del rechazo.');
      return;
    }

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const timeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    const newLogMsg = status === 'Rechazado'
      ? `Trámite RECHAZADO por el Administrador. Motivo: ${rejectReason}`
      : `Estatus actualizado a ${status} por el Administrador.`;

    const updated = tramites.map(item => {
      if (item.id === activeReview.id) {
        const currentLogs = item.logs || [];
        const newLogs = [...currentLogs, { date: `${dateStr} ${timeStr}`, message: newLogMsg }];
        
        return {
          ...item,
          status: status,
          endDate: (status === 'Pagado' || status === 'Rechazado') ? dateStr : item.endDate,
          logs: newLogs
        };
      }
      return item;
    });

    setTramites(updated);
    localStorage.setItem('ayudatelmex_admin_tramites', JSON.stringify(updated));

    // Also update in associate list if it exists there!
    const asocStored = localStorage.getItem('ayudatelmex_asoc_tramites');
    if (asocStored) {
      const asocList = JSON.parse(asocStored);
      const targetClaim = updated.find(t => t.id === activeReview.id);
      
      if (targetClaim) {
        const updatedAsoc = asocList.map(item => {
          if (item.id === activeReview.id) {
            return {
              ...item,
              status: targetClaim.status,
              endDate: targetClaim.endDate,
              logs: targetClaim.logs
            };
          }
          return item;
        });
        localStorage.setItem('ayudatelmex_asoc_tramites', JSON.stringify(updatedAsoc));
      }
    }

    // Side effects on approval
    if (status === 'Aprobado') {
      const targetClaim = updated.find(t => t.id === activeReview.id);
      if (targetClaim && targetClaim.details) {
        if (targetClaim.type.includes('Beneficiarios') && targetClaim.details.beneficiaries) {
          localStorage.setItem('ayudatelmex_user_beneficiaries', JSON.stringify(targetClaim.details.beneficiaries));
          toast.success("Beneficiarios oficiales actualizados en el padrón del asociado.");
        }
        if (targetClaim.type.includes('Contacto') && targetClaim.details.phone) {
          localStorage.setItem('ayudatelmex_user_phone', targetClaim.details.phone);
          localStorage.setItem('ayudatelmex_user_email', targetClaim.details.email);
          localStorage.setItem('ayudatelmex_user_address', targetClaim.details.address);
          toast.success("Datos de contacto oficiales actualizados en el padrón del asociado.");
        }
      }
    }

    if (status === 'Rechazado') {
      toast.success("Trámite rechazado correctamente");
    } else {
      toast.success(`El trámite ${activeReview.id} de ${activeReview.name} fue marcado como ${status} correctamente.`);
    }
    setActiveReview(null);
    setRejectReason('');
  };

  return (
    <div className="flex bg-neutral-bg min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8 text-left">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-primary-deep tracking-tight">Control y Auditoría de Trámites</h2>
          <p className="text-base text-neutral-muted mt-1">Revise las solicitudes recibidas de los asociados y asigne dictámenes de validación.</p>
        </div>

        {/* Filter controls */}
        <Card className="mb-8 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Buscar por asociado o ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl text-base font-semibold focus:border-primary-brand focus:ring-1 focus:ring-primary-brand min-h-[44px]"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 text-base font-semibold bg-white min-h-[44px]"
              >
                <option value="todos">Todos los Trámites</option>
                <option value="Cuotas">Recuperación de Cuotas</option>
                <option value="Beneficiarios">Actualización de Beneficiarios</option>
                <option value="Académico">Premio Académico</option>
                <option value="Boliche">Registro Evento Boliche</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 text-base font-semibold bg-white min-h-[44px]"
              >
                <option value="todos">Todos los Estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Revisión">En Revisión</option>
                <option value="En Validación">En Validación</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Main Claims Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">ID</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Asociado</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Tipo Trámite</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Fecha</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted text-right">Importe</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted text-center">Estatus</th>
                  <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTramites.map((t, i) => (
                  <tr key={i} className="border-b border-gray-150 hover:bg-gray-50/50">
                    <td className="py-4 text-sm font-bold text-neutral-muted">{t.id}</td>
                    <td className="py-4 text-base font-bold text-neutral-dark">{t.name}</td>
                    <td className="py-4 text-base text-neutral-dark">{t.type}</td>
                    <td className="py-4 text-sm text-neutral-muted">{t.date}</td>
                    <td className="py-4 text-base font-bold text-neutral-dark text-right">{formatCurrency(t.amount)}</td>
                    <td className="py-4 text-center">{getStatusBadge(t.status)}</td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => setActiveExpediente(t)}
                          className="py-1.5 px-3 text-sm min-h-0 font-bold flex items-center gap-1.5"
                        >
                          <FolderOpen className="h-4 w-4" />
                          <span>Ver Expediente</span>
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => setActiveReview(t)}
                          className="py-1.5 px-3 text-sm min-h-0 font-bold"
                        >
                          Evaluar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredTramites.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-lg font-semibold text-neutral-muted">
                      No se encontraron trámites para los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Modal: Claim Review Evaluation */}
      {activeReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="bg-primary-deep text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Eye className="h-5 w-5 text-accent-tech" />
                <span>Dictamen Técnico: {activeReview.id}</span>
              </h3>
              <button 
                onClick={() => { setActiveReview(null); setRejectReason(''); }} 
                className="p-1 rounded-lg hover:bg-white/10 text-white focus-visible:outline-none"
                aria-label="Cerrar modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6 text-left max-h-[60vh] overflow-y-auto">
              
              {/* Workflow Visual tipo Bizagi (Sprint 2) */}
              <div className="space-y-3 pb-4 border-b border-gray-150">
                <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Flujo de Proceso (BPM - Amazon Style)</span>
                <div className="flex items-center justify-between bg-neutral-bg p-4 rounded-2xl border border-gray-150 overflow-x-auto gap-2">
                  {[
                    { label: 'Recibido', active: true },
                    { label: 'En revisión', active: ['En revisión', 'En Revisión', 'Revisión de Documentos', 'Validación de Aportaciones', 'En Validación', 'Aprobado', 'Pagado'].includes(activeReview.status) },
                    { label: 'Aprobado', active: ['Aprobado', 'Pagado'].includes(activeReview.status) },
                    { label: 'Pagado', active: activeReview.status === 'Pagado' }
                  ].map((step, idx, arr) => (
                    <React.Fragment key={idx}>
                      <div className="flex flex-col items-center min-w-[70px] text-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          step.active 
                            ? 'bg-success-trust text-white shadow-xs ring-4 ring-success-trust/10' 
                            : 'bg-gray-250 text-gray-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[10px] font-bold mt-1.5 transition-colors duration-300 ${
                          step.active ? 'text-primary-deep' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className={`h-0.5 flex-1 min-w-[20px] transition-colors duration-300 ${
                          arr[idx + 1].active ? 'bg-success-trust' : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-bg p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="block text-xs font-bold text-neutral-muted uppercase">Asociado Solicitante</span>
                  <span className="block text-base font-bold text-neutral-dark">{activeReview.name}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-neutral-muted uppercase">Tipo de Trámite</span>
                  <span className="block text-base font-bold text-neutral-dark">{activeReview.type}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-neutral-muted uppercase">Fecha de Recepción</span>
                  <span className="block text-base text-neutral-dark">{activeReview.date}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-neutral-muted uppercase">Importe Solicitado</span>
                  <span className="block text-base font-bold text-primary-brand">{formatCurrency(activeReview.amount)}</span>
                </div>
              </div>

              {/* Status display */}
              <div>
                <span className="block text-xs font-bold text-neutral-muted uppercase mb-1">Estatus Actual</span>
                {getStatusBadge(activeReview.status)}
              </div>

              {/* Badge de Riesgo y Análisis Rius AI (Tarea 6) */}
              {(() => {
                const analysis = getRiusAiAnalysis(activeReview);
                return (
                  <div className="space-y-3 p-4 rounded-2xl border border-gray-150 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Evaluación de Riesgo</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${analysis.color}`}>
                        ● {analysis.text}
                      </span>
                    </div>
                    <div className="space-y-1 pt-2 border-t border-gray-200">
                      <span className="block text-xs font-bold text-primary-deep uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-primary-brand rounded-full animate-pulse" />
                        Análisis Automático Rius AI
                      </span>
                      <p className="text-sm text-neutral-dark font-medium leading-relaxed italic">
                        "{analysis.analysis}"
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Reject details */}
              <div className="space-y-2">
                <label htmlFor="reject-reason" className="block text-base font-bold text-neutral-dark">
                  Observaciones / Motivo de Rechazo (Opcional si Aprueba)
                </label>
                <textarea
                  id="reject-reason"
                  rows="3"
                  placeholder="Escriba aquí los comentarios técnicos, documentos faltantes o aclaraciones."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="block w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 text-base font-semibold focus:border-primary-brand focus:ring-1 focus:ring-primary-brand"
                />
              </div>

              {/* Historial de Validaciones (Timeline) */}
              <div className="space-y-4 pt-4 border-t border-gray-150">
                <h4 className="text-base font-bold text-primary-deep uppercase tracking-wider">Historial de Validaciones</h4>
                <div className="relative border-l-2 border-gray-250 ml-2 pl-4 space-y-4">
                  {getHistorial(activeReview.id).map((h, index) => (
                    <div key={index} className="relative text-sm">
                      {/* Dot */}
                      <span className="absolute -left-[21px] top-1.5 bg-primary-brand h-2.5 w-2.5 rounded-full ring-4 ring-white" />
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-muted font-bold">{h.date} — {h.user}</span>
                        <span className="font-bold text-neutral-dark mt-0.5">
                          Estado: <span className={
                            h.status === 'Aprobado' ? 'text-success-trust' :
                            h.status === 'Rechazado' ? 'text-red-650 text-red-600' :
                            h.status === 'Reabierto' ? 'text-primary-brand' : 'text-neutral-dark'
                          }>{h.status}</span>
                        </span>
                        {h.notes && (
                          <p className="text-xs text-neutral-muted mt-1 bg-gray-50 p-2.5 rounded-xl border border-gray-150 font-normal leading-relaxed">
                            {h.notes}
                          </p>
                        )}
                        {/* Firma Electrónica Avanzada FIEL (Sprint 2) */}
                        {(h.status === 'Aprobado' || h.status === 'Rechazado') && (
                          <div className="mt-2.5 bg-success-trust/5 border border-success-trust/20 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] font-mono text-neutral-muted">
                            <div>
                              <span className="block font-sans font-bold text-neutral-dark text-xxs">Firma Electrónica Avanzada (FIEL)</span>
                              <span className="block mt-0.5">Firmante: {h.user}</span>
                              <span className="block">Fecha Firma: {h.date} 10:42:15 AM</span>
                            </div>
                            <div className="text-left sm:text-right max-w-[200px] shrink-0">
                              <span className="block font-sans font-bold text-success-trust">VALIDADO SHA-256</span>
                              <span className="block mt-0.5 truncate text-[9px]" title="SHA-256 Hash Autógrafo Fideicomiso">
                                f7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-150">
              {activeReview.status === 'Recibido' && (
                <>
                  <Button
                    variant="danger"
                    className="py-2.5 px-4 text-base"
                    onClick={() => handleAction('Rechazado')}
                  >
                    Rechazar Trámite
                  </Button>
                  <Button
                    variant="primary"
                    className="py-2.5 px-6 text-base bg-accent-tech hover:bg-primary-brand"
                    onClick={() => handleAction('En revisión')}
                  >
                    Iniciar Revisión (BPM)
                  </Button>
                </>
              )}
              {['En revisión', 'En Revisión', 'Revisión de Documentos', 'Validación de Aportaciones', 'En Validación'].includes(activeReview.status) && (
                <>
                  <Button
                    variant="danger"
                    className="py-2.5 px-4 text-base"
                    onClick={() => handleAction('Rechazado')}
                  >
                    Rechazar Trámite
                  </Button>
                  <Button
                    variant="success"
                    className="py-2.5 px-6 text-base"
                    onClick={() => handleAction('Aprobado')}
                  >
                    Aprobar Trámite
                  </Button>
                </>
              )}
              {activeReview.status === 'Aprobado' && (
                <>
                  <Button
                    variant="danger"
                    className="py-2.5 px-4 text-base"
                    onClick={() => handleAction('Rechazado')}
                  >
                    Rechazar Depósito
                  </Button>
                  <Button
                    variant="success"
                    className="py-2.5 px-6 text-base bg-success-trust hover:bg-[#008f65]"
                    onClick={() => handleAction('Pagado')}
                  >
                    Confirmar Depósito (Pagado)
                  </Button>
                </>
              )}
              {(activeReview.status === 'Pagado' || activeReview.status === 'Rechazado') && (
                <Button
                  variant="secondary"
                  className="py-2.5 px-6 text-base"
                  onClick={() => { setActiveReview(null); setRejectReason(''); }}
                >
                  Cerrar Ventana
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Expediente Digital */}
      {activeExpediente && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
            {/* Header */}
            <div className="bg-primary-deep text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-accent-tech" />
                <span>Expediente Digital: {activeExpediente.id}</span>
              </h3>
              <button 
                onClick={() => setActiveExpediente(null)} 
                className="p-1 rounded-lg hover:bg-white/10 text-white focus-visible:outline-none cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6 text-left max-h-[60vh] overflow-y-auto">
              <div className="bg-neutral-bg p-4 rounded-xl border border-gray-250">
                <span className="block text-xs font-bold text-neutral-muted uppercase">Asociado</span>
                <span className="block text-lg font-bold text-primary-deep">{activeExpediente.name}</span>
                <span className="block text-xs text-neutral-muted mt-1">Trámite: {activeExpediente.type}</span>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-bold text-primary-deep uppercase tracking-wider font-extrabold">Documentos Recibidos</h4>
                
                <div className="space-y-3">
                  {[
                    { label: 'CURP', fileName: 'CURP_Validado_RENAPO.pdf' },
                    { label: 'Identificación Oficial', fileName: 'INE_Anverso_Reverso.pdf' },
                    { label: 'Recibo de Nómina', fileName: 'Recibo_Nomina_Mayo2026.pdf' },
                    { label: 'Comprobante Bancario', fileName: 'Comprobante_CLABE_Interbancaria.pdf' },
                    { label: 'Solicitud Firmada', fileName: 'Carta_Conformidad_Firmada.pdf' }
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-150 rounded-xl hover:bg-white transition-colors">
                      <div className="flex items-start gap-2.5">
                        <span className="text-success-trust text-base mt-0.5" aria-hidden="true">✅</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-dark text-sm leading-tight">{doc.label}</span>
                          <span className="text-xs text-neutral-muted">{doc.fileName}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          toast.success(`Abriendo copia digital de ${doc.label}...`);
                          window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
                        }}
                        className="inline-flex items-center gap-1.5 text-primary-brand hover:text-primary-deep font-bold text-xs bg-primary-brand/5 hover:bg-primary-brand/10 px-3 py-1.5 rounded-lg border border-primary-brand/10 transition-colors focus-visible:outline-none cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Ver PDF</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-150">
              <Button
                variant="secondary"
                className="py-2 px-6 text-sm min-h-0 font-bold"
                onClick={() => setActiveExpediente(null)}
              >
                Cerrar Expediente
              </Button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
