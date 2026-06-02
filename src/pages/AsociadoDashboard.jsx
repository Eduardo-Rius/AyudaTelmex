import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PiggyBank, ClipboardList, Calendar, Bell, ChevronRight, UserCheck, X, FileText, CheckCircle2, Clock, TrendingUp, Layers, Users, AlertCircle } from 'lucide-react';
import PrivateHeader from '../components/layout/PrivateHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { LOGGED_IN_USER, MOCK_EVENTS } from '../data/mockData';

export default function AsociadoDashboard() {
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [tramites, setTramites] = useState(() => {
    const stored = localStorage.getItem('ayudatelmex_asoc_tramites');
    if (stored) {
      return JSON.parse(stored);
    }
    const list = [...LOGGED_IN_USER.activeTramites, ...LOGGED_IN_USER.completedTramites];
    localStorage.setItem('ayudatelmex_asoc_tramites', JSON.stringify(list));
    return list;
  });

  // Sync state between open windows or local edits
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('ayudatelmex_asoc_tramites');
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

  const activeTramites = tramites.filter(t => t.status !== 'Pagado' && t.status !== 'Rechazado' && !t.endDate);
  const completedTramites = tramites.filter(t => t.status === 'Pagado' || t.status === 'Rechazado' || t.endDate);

  const currentSelected = selectedTramite ? tramites.find(t => t.id === selectedTramite.id) || selectedTramite : null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprobado':
        return <CheckCircle2 className="h-6 w-6 text-success-trust" />;
      case 'Revisión de Documentos':
      case 'Validación de Aportaciones':
      case 'En Validación':
      case 'En Revisión':
        return <Clock className="h-6 w-6 text-warning-alert" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <PrivateHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="block text-sm font-bold text-primary-brand uppercase tracking-wider">Zona de Asociados</span>
            <h2 className="text-3xl font-extrabold text-primary-deep">¡Bienvenido, {LOGGED_IN_USER.name}!</h2>
            <p className="text-base text-neutral-muted">
              Número de Asociado: <span className="font-bold text-neutral-dark">{LOGGED_IN_USER.id}</span> | {LOGGED_IN_USER.company}
            </p>
          </div>
          <div className="bg-success-trust/10 text-success-trust border border-success-trust/30 px-4 py-2 rounded-2xl flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            <span className="font-bold text-base">Estatus: {LOGGED_IN_USER.status}</span>
          </div>
        </div>
        
        {/* KPI Cards Row (Paso 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Aportaciones Acumuladas */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Aportaciones Acumuladas</span>
              <span className="block text-2xl font-black text-primary-deep">{formatCurrency(LOGGED_IN_USER.accumulatedCuotas)}</span>
              <span className="block text-[10px] text-neutral-muted">Cuotas de nómina ingresadas</span>
            </div>
            <div className="bg-primary-brand/10 text-primary-brand p-3 rounded-xl">
              <PiggyBank className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Rendimientos Generados */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Rendimientos Generados</span>
              <span className="block text-2xl font-black text-success-trust">{formatCurrency(12850.00)}</span>
              <span className="block text-[10px] text-success-trust font-semibold">Tasa anual promedio ~8.45%</span>
            </div>
            <div className="bg-success-trust/10 text-success-trust p-3 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: Fondo Total */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Fondo Total</span>
              <span className="block text-2xl font-black text-primary-deep">{formatCurrency(LOGGED_IN_USER.accumulatedCuotas + 12850.00)}</span>
              <span className="block text-[10px] text-neutral-muted">Saldo disponible proyectado</span>
            </div>
            <div className="bg-primary-brand/10 text-primary-brand p-3 rounded-xl">
              <Layers className="h-6 w-6" />
            </div>
          </div>

          {/* Card 4: Antigüedad */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Antigüedad</span>
              <span className="block text-2xl font-black text-primary-deep">18 Años</span>
              <span className="block text-[10px] text-neutral-muted">Afiliado desde Noviembre 2008</span>
            </div>
            <div className="bg-primary-deep/5 text-primary-deep p-3 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols): Primary Cards */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Card 1: Cuotas Acumuladas & Recovery */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-l-8 border-l-primary-brand">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary-brand/10 p-4 rounded-2xl text-primary-brand">
                    <PiggyBank className="h-10 w-10" />
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="block text-sm font-bold text-neutral-muted uppercase tracking-wider">Mis Cuotas Acumuladas</span>
                    <span className="block text-4xl font-black text-primary-deep">{formatCurrency(LOGGED_IN_USER.accumulatedCuotas)}</span>
                    <span className="block text-sm text-neutral-muted">
                      Elegibilidad: A partir de los {LOGGED_IN_USER.eligibleAgeRecovery} años. (Edad actual: {LOGGED_IN_USER.age} años)
                    </span>
                  </div>
                </div>
                
                <Link to="/asociado/recuperacion-cuotas" className="w-full sm:w-auto">
                  <Button variant="success" className="w-full sm:w-auto shadow-md">
                    Solicitar Recuperación
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Centro de Trámites Digitales Card Grid */}
            <Card title="Centro de Trámites Digitales">
              <p className="text-sm text-neutral-muted -mt-3 mb-6">
                Inicie sus solicitudes y trámites oficiales de forma 105% digital y realice el seguimiento en tiempo real.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/asociado/nuevo-tramite/prestamo" className="group">
                  <div className="p-5 border border-gray-200 rounded-2xl hover:border-primary-brand/50 hover:bg-primary-deep/5 transition-all flex flex-col justify-between h-full gap-4 text-left">
                    <div>
                      <div className="bg-primary-brand/10 text-primary-brand p-3 rounded-xl w-fit group-hover:bg-primary-brand group-hover:text-white transition-colors">
                        <FileText className="h-6 w-6" />
                      </div>
                      <h4 className="font-extrabold text-primary-deep text-lg mt-3">Préstamo Mutualista</h4>
                      <p className="text-xs text-neutral-muted mt-1 leading-normal">
                        Solicitud de préstamo preferencial con tasa del 6% anual (máx. 80% de sus cuotas).
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-brand group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-auto">
                      Iniciar Trámite <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>

                <Link to="/asociado/nuevo-tramite/beneficiarios" className="group">
                  <div className="p-5 border border-gray-200 rounded-2xl hover:border-primary-brand/50 hover:bg-primary-deep/5 transition-all flex flex-col justify-between h-full gap-4 text-left">
                    <div>
                      <div className="bg-primary-brand/10 text-primary-brand p-3 rounded-xl w-fit group-hover:bg-primary-brand group-hover:text-white transition-colors">
                        <Users className="h-6 w-6" />
                      </div>
                      <h4 className="font-extrabold text-primary-deep text-lg mt-3">Cambio de Beneficiarios</h4>
                      <p className="text-xs text-neutral-muted mt-1 leading-normal">
                        Modificación y redistribución de los porcentajes asignados en su póliza.
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-brand group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-auto">
                      Iniciar Trámite <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>

                <Link to="/asociado/nuevo-tramite/actualizacion" className="group">
                  <div className="p-5 border border-gray-200 rounded-2xl hover:border-primary-brand/50 hover:bg-primary-deep/5 transition-all flex flex-col justify-between h-full gap-4 text-left">
                    <div>
                      <div className="bg-primary-brand/10 text-primary-brand p-3 rounded-xl w-fit group-hover:bg-primary-brand group-hover:text-white transition-colors">
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <h4 className="font-extrabold text-primary-deep text-lg mt-3">Actualización de Datos</h4>
                      <p className="text-xs text-neutral-muted mt-1 leading-normal">
                        Actualice su dirección, teléfono o correo electrónico registrado.
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-brand group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-auto">
                      Iniciar Trámite <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>

                <Link to="/asociado/nuevo-tramite/retiro-parcial" className="group">
                  <div className="p-5 border border-gray-200 rounded-2xl hover:border-primary-brand/50 hover:bg-primary-deep/5 transition-all flex flex-col justify-between h-full gap-4 text-left">
                    <div>
                      <div className="bg-primary-brand/10 text-primary-brand p-3 rounded-xl w-fit group-hover:bg-primary-brand group-hover:text-white transition-colors">
                        <PiggyBank className="h-6 w-6" />
                      </div>
                      <h4 className="font-extrabold text-primary-deep text-lg mt-3">Retiro Parcial por Emergencia</h4>
                      <p className="text-xs text-neutral-muted mt-1 leading-normal">
                        Retiro de hasta el 30% del fondo acumulado ante situaciones graves comprobables.
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary-brand group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-auto">
                      Iniciar Trámite <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Card 2: Mi Póliza & Beneficiarios */}
            <Card title="Mi Póliza Mutualista">
              <div className="space-y-6 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-neutral-bg p-5 rounded-2xl border border-gray-200">
                  <div>
                    <span className="block text-xs font-bold text-neutral-muted uppercase">Tipo de Cobertura</span>
                    <span className="block text-base font-bold text-primary-deep">{LOGGED_IN_USER.policyType}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-muted uppercase">Estatus Seguro de Vida</span>
                    <span className="block text-base font-bold text-success-trust">✓ Vigente y Activa</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-muted uppercase">Última Aportación</span>
                    <span className="block text-base font-bold text-neutral-dark">Descontada de Nómina</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-primary-deep">Beneficiarios Registrados ({LOGGED_IN_USER.beneficiaries.length})</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-left">
                          <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Nombre Completo</th>
                          <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted">Parentesco</th>
                          <th scope="col" className="pb-3 font-bold text-sm text-neutral-muted text-right">Porcentaje asignado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {LOGGED_IN_USER.beneficiaries.map((b, i) => (
                          <tr key={i} className="border-b border-gray-150 hover:bg-gray-50/50">
                            <td className="py-3 text-base font-bold text-neutral-dark">{b.name}</td>
                            <td className="py-3 text-base text-neutral-muted">{b.relationship}</td>
                            <td className="py-3 text-base font-bold text-primary-brand text-right">{b.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 3: Mis Trámites en Proceso */}
            <Card title="Seguimiento de Mis Trámites">
              <div className="space-y-4 text-left">
                {activeTramites.map((t, i) => (
                  <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-gray-200 rounded-2xl hover:border-primary-brand/50 transition-all bg-white gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="p-3 bg-primary-brand/10 text-primary-brand rounded-xl">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-primary-deep">{t.type}</h4>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(t.status)}
                          <span className="text-base text-neutral-muted font-bold">Estatus: {t.status}</span>
                        </div>
                        <span className="block text-xs text-neutral-muted">Iniciado el: {t.startDate || t.date}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="secondary"
                      className="w-full sm:w-auto py-2.5 px-4 text-base"
                      onClick={() => setSelectedTramite(t)}
                    >
                      Ver seguimiento
                    </Button>
                  </div>
                ))}

                {activeTramites.length === 0 && (
                  <p className="text-sm text-neutral-muted italic text-center py-4">No tiene trámites activos en proceso.</p>
                )}

                <div className="border-t border-gray-100 pt-4 mt-6">
                  <h4 className="text-base font-bold text-neutral-muted uppercase tracking-wider mb-3">Historial de Trámites Terminados</h4>
                  {completedTramites.map((t, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-2 px-3 bg-gray-50 rounded-lg mb-2">
                      <span className="font-bold text-neutral-dark">{t.type}</span>
                      <span className={t.status === 'Rechazado' ? 'text-red-600 font-bold' : 'text-success-trust font-bold flex items-center gap-1'}>
                        {t.status === 'Rechazado' ? `✗ Rechazado (${t.endDate || t.date})` : `✓ Completado (${t.endDate || t.date})`}
                      </span>
                    </div>
                  ))}
                  {completedTramites.length === 0 && (
                    <p className="text-xs text-neutral-muted italic">No hay trámites finalizados anteriormente.</p>
                  )}
                </div>
              </div>
            </Card>

          </div>

          {/* Right Column (4 cols): Secondary / Info Cards */}
          <div className="lg:col-span-4 space-y-8 text-left">
            
            {/* Card 4: Avisos Importantes */}
            <Card className="border-t-8 border-t-warning-alert">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary-deep flex items-center gap-2">
                  <Bell className="h-5 w-5 text-warning-alert" />
                  <span>Avisos Importantes</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-1 pb-4 border-b border-gray-100">
                    <span className="inline-block bg-accent-tech/15 text-primary-deep text-xs font-bold px-2 py-0.5 rounded">Académico</span>
                    <h4 className="font-bold text-neutral-dark text-base">Convocatoria Beca Desempeño 2026</h4>
                    <p className="text-sm text-neutral-muted leading-relaxed">
                      El plazo para cargar boletas escolares de fin de ciclo cierra el 15 de Junio.
                    </p>
                  </div>

                  <div className="space-y-1 pb-4 border-b border-gray-100">
                    <span className="inline-block bg-primary-brand/15 text-primary-deep text-xs font-bold px-2 py-0.5 rounded">Fideicomiso</span>
                    <h4 className="font-bold text-neutral-dark text-base">Actualización Anual de Datos</h4>
                    <p className="text-sm text-neutral-muted leading-relaxed">
                      Revise la información y porcentaje de beneficiarios para mantener activa su póliza sin contratiempos.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block bg-success-trust/15 text-[#008f65] text-xs font-bold px-2 py-0.5 rounded">Deportivo</span>
                    <h4 className="font-bold text-neutral-dark text-base">Torneos Nacionales Mutua</h4>
                    <p className="text-sm text-neutral-muted leading-relaxed">
                      Los registros para boliche, dominó y ajedrez están abiertos en la sección de eventos.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 5: Próximos Eventos */}
            <Card>
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary-deep flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-brand" />
                  <span>Comunidad y Eventos</span>
                </h3>

                <div className="space-y-4">
                  {MOCK_EVENTS.slice(0, 3).map((e, i) => (
                    <div key={i} className="p-4 bg-neutral-bg border border-gray-200 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-primary-brand block">{e.date}</span>
                      <h4 className="font-bold text-neutral-dark text-base leading-tight">{e.title}</h4>
                      <p className="text-xs text-neutral-muted">{e.venue}</p>
                    </div>
                  ))}
                </div>

                <Link to="/asociado/eventos" className="block">
                  <Button variant="secondary" className="w-full flex items-center justify-center gap-2 text-base py-3">
                    <span>Ver Todos los Eventos</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>

          </div>

        </div>
      </main>

      {/* Modal: Ver seguimiento de Trámite */}
      {currentSelected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="bg-primary-deep text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Bitácora de Trámite</h3>
              <button 
                onClick={() => setSelectedTramite(null)} 
                className="p-1 rounded-lg hover:bg-white/10 text-white focus-visible:outline-none cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6 text-left max-h-[70vh] overflow-y-auto">
              
              {/* Stepper visual tipo Amazon */}
              {currentSelected.status !== 'Rechazado' ? (
                <div className="space-y-3 pb-4 border-b border-gray-150">
                  <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Estado del Trámite (BPM)</span>
                  <div className="flex items-center justify-between bg-neutral-bg p-4 rounded-2xl border border-gray-150 overflow-x-auto gap-2">
                    {[
                      { label: 'Recibido', key: 'Recibido' },
                      { label: 'En revisión', key: 'En revisión' },
                      { label: 'Aprobado', key: 'Aprobado' },
                      { label: 'Pagado', key: 'Pagado' }
                    ].map((step, idx, arr) => {
                      const getBpmStep = (status) => {
                        switch (status) {
                          case 'Recibido': return 0;
                          case 'En revisión':
                          case 'En Revisión':
                          case 'Revisión de Documentos':
                          case 'Validación de Aportaciones':
                          case 'En Validación':
                            return 1;
                          case 'Aprobado': return 2;
                          case 'Pagado': return 3;
                          default: return 0;
                        }
                      };
                      const currentActiveStep = getBpmStep(currentSelected.status);
                      const isCompleted = idx < currentActiveStep;
                      const isActive = idx === currentActiveStep;
                      
                      return (
                        <React.Fragment key={idx}>
                          <div className="flex flex-col items-center min-w-[70px] text-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-success-trust text-white shadow-xs' 
                                : isActive 
                                ? 'bg-warning-alert text-white shadow-xs ring-4 ring-warning-alert/20 animate-pulse' 
                                : 'bg-gray-250 text-gray-400'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[10px] font-bold mt-1.5 transition-colors duration-300 ${
                              isCompleted || isActive ? 'text-primary-deep font-bold' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                          {idx < arr.length - 1 && (
                            <div className={`h-0.5 flex-1 min-w-[20px] transition-colors duration-300 ${
                              idx < currentActiveStep ? 'bg-success-trust' : 'bg-gray-200'
                            }`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 text-red-650 text-red-600 rounded-2xl flex gap-3 text-sm font-bold items-start mb-2">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <span className="block text-base font-extrabold">Trámite Rechazado</span>
                    <p className="font-semibold text-xs text-neutral-muted mt-1 leading-normal">
                      Este trámite no fue aprobado por el Comité de Fideicomiso.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <span className="block text-xs font-bold text-neutral-muted uppercase">Tipo de Trámite</span>
                <span className="block text-lg font-black text-primary-deep">{currentSelected.type}</span>
              </div>

              {currentSelected.amount && (
                <div>
                  <span className="block text-xs font-bold text-neutral-muted uppercase">Monto</span>
                  <span className="block text-xl font-black text-success-trust">{formatCurrency(currentSelected.amount)}</span>
                </div>
              )}

              {/* Conditional metadata details */}
              {currentSelected.details && (
                <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl space-y-2 text-xs">
                  <span className="block font-bold text-neutral-muted uppercase">Detalles Registrados</span>
                  {currentSelected.details.phone && (
                    <div className="space-y-1">
                      <p><span className="font-bold text-neutral-dark">Teléfono Celular:</span> {currentSelected.details.phone}</p>
                      <p><span className="font-bold text-neutral-dark">Correo Electrónico:</span> {currentSelected.details.email}</p>
                      <p><span className="font-bold text-neutral-dark">Nuevo Domicilio:</span> {currentSelected.details.address}</p>
                    </div>
                  )}
                  {currentSelected.details.beneficiaries && (
                    <div className="space-y-1">
                      <span className="font-bold text-neutral-dark block">Nuevos Beneficiarios:</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {currentSelected.details.beneficiaries.map((b, i) => (
                          <li key={i}>{b.name} ({b.relationship}) - {b.percentage}%</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-base font-bold text-primary-deep border-b border-gray-150 pb-2">Movimientos Registrados</h4>
                <div className="space-y-4">
                  {currentSelected.logs && currentSelected.logs.map((log, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="relative flex flex-col items-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-primary-brand z-10"></div>
                        {index < currentSelected.logs.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 absolute top-3.5"></div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="block text-xs text-neutral-muted font-bold">{log.date}</span>
                        <p className="text-sm text-neutral-dark font-medium leading-relaxed">{log.message}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Current Active Step representation in log if not rejected/completed */}
                  {currentSelected.status !== 'Pagado' && currentSelected.status !== 'Rechazado' && (
                    <div className="flex gap-3">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-warning-alert bg-white z-10 animate-pulse"></div>
                      <div className="space-y-1">
                        <span className="block text-xs text-warning-alert font-bold">Estado Actual</span>
                        <p className="text-sm text-neutral-dark font-bold leading-relaxed">{currentSelected.status}</p>
                        <p className="text-xs text-neutral-muted">En revisión por personal técnico del Fideicomiso.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-150">
              <Button variant="primary" className="py-2.5 px-6 text-base" onClick={() => setSelectedTramite(null)}>
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
