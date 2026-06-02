import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Users, 
  ShieldCheck, 
  Edit3, 
  X, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import PrivateHeader from '../components/layout/PrivateHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { LOGGED_IN_USER } from '../data/mockData';

export default function AsociadoPerfil() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // States initialized from localStorage or defaults
  const [phoneVal, setPhoneVal] = useState(() => localStorage.getItem('ayudatelmex_user_phone') || '55-1234-5678');
  const [emailVal, setEmailVal] = useState(() => localStorage.getItem('ayudatelmex_user_email') || 'eduardo.rius@gmail.com');
  const [addressVal, setAddressVal] = useState(() => localStorage.getItem('ayudatelmex_user_address') || 'Av. Marina Nacional 365, Col. Verónica Anzures, CDMX');
  const [beneficiariesList, setBeneficiariesList] = useState(() => {
    const stored = localStorage.getItem('ayudatelmex_user_beneficiaries');
    return stored ? JSON.parse(stored) : LOGGED_IN_USER.beneficiaries;
  });

  // Sync state if localStorage changes in background
  useEffect(() => {
    const handleStorageChange = () => {
      setPhoneVal(localStorage.getItem('ayudatelmex_user_phone') || '55-1234-5678');
      setEmailVal(localStorage.getItem('ayudatelmex_user_email') || 'eduardo.rius@gmail.com');
      setAddressVal(localStorage.getItem('ayudatelmex_user_address') || 'Av. Marina Nacional 365, Col. Verónica Anzures, CDMX');
      const storedBens = localStorage.getItem('ayudatelmex_user_beneficiaries');
      if (storedBens) {
        setBeneficiariesList(JSON.parse(storedBens));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const profileDetails = {
    rfc: 'RITE600525HDF',
    curp: 'RITE600525HDFTS01',
    address: addressVal,
    phone: phoneVal,
    memberSince: '12 de Noviembre, 2008'
  };

  const handleOpenModal = () => {
    setRequestText('');
    setRequestSubmitted(false);
    setIsUpdateModalOpen(true);
  };

  const handleProcessRequest = (e) => {
    e.preventDefault();
    if (!requestText.trim()) {
      toast.error("Por favor escriba las actualizaciones solicitadas.");
      return;
    }

    setRequestSubmitted(true);
    toast.success("Solicitud de actualización enviada con éxito.");
    
    setTimeout(() => {
      setIsUpdateModalOpen(false);
      setRequestSubmitted(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <PrivateHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
        {/* Page Header */}
        <div className="mb-8">
          <span className="px-3 py-1 bg-primary-brand/5 text-primary-brand text-xs font-black rounded-full uppercase tracking-wider border border-primary-brand/10">
            Mi Cuenta
          </span>
          <h2 className="text-3xl font-extrabold text-primary-deep tracking-tight mt-2">Perfil de Asociado</h2>
          <p className="text-base text-neutral-muted mt-1">
            Gestión de datos de afiliación, información de contacto y beneficiarios del Fideicomiso.
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: General Info (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Card: Personal Details */}
            <Card 
              title="Información Personal y Laboral"
              headerAction={
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary-brand hover:text-primary-deep bg-primary-brand/5 hover:bg-primary-brand/10 px-3 py-1.5 rounded-lg border border-primary-brand/10 transition-all cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Solicitar Actualización</span>
                </button>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                {/* Nombre */}
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                  <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Nombre Completo</span>
                  <span className="block text-base font-bold text-primary-deep mt-1">{LOGGED_IN_USER.name}</span>
                </div>

                {/* ID Asociado */}
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                  <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">ID de Asociado</span>
                  <span className="block text-base font-bold text-primary-deep mt-1">{LOGGED_IN_USER.id}</span>
                </div>

                {/* Empresa */}
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                  <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Empresa Depositaria</span>
                  <span className="block text-base font-bold text-primary-deep mt-1">{LOGGED_IN_USER.company}</span>
                </div>

                {/* RFC */}
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                  <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Registro Federal de Contribuyentes (RFC)</span>
                  <span className="block text-base font-bold text-neutral-dark mt-1 font-mono">{profileDetails.rfc}</span>
                </div>

                {/* CURP */}
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                  <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Clave Única de Registro de Población (CURP)</span>
                  <span className="block text-base font-bold text-neutral-dark mt-1 font-mono">{profileDetails.curp}</span>
                </div>

                {/* Antiguedad */}
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                  <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Fecha de Alta en Fideicomiso</span>
                  <span className="block text-base font-bold text-neutral-dark mt-1">{profileDetails.memberSince}</span>
                </div>
              </div>
            </Card>

            {/* Card: Contact Info */}
            <Card title="Información de Contacto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                {/* Correo */}
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center gap-3">
                  <div className="bg-primary-deep/5 text-primary-brand p-2.5 rounded-xl">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Correo Electrónico</span>
                    <span className="block text-base font-bold text-neutral-dark">{emailVal}</span>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center gap-3">
                  <div className="bg-primary-deep/5 text-primary-brand p-2.5 rounded-xl">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Teléfono de Contacto</span>
                    <span className="block text-base font-bold text-neutral-dark">{phoneVal}</span>
                  </div>
                </div>

                {/* Domicilio */}
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center gap-3 sm:col-span-2">
                  <div className="bg-primary-deep/5 text-primary-brand p-2.5 rounded-xl shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xxs font-extrabold text-neutral-muted uppercase tracking-wider">Domicilio Registrado</span>
                    <span className="block text-base font-bold text-neutral-dark leading-relaxed">{addressVal}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Beneficiaries (4 cols) */}
          <div className="lg:col-span-4">
            <Card title="Beneficiarios de la Póliza">
              <p className="text-xs text-neutral-muted -mt-3 mb-6">
                Personas designadas para recibir el saldo acumulado o seguro mutualista de vida.
              </p>
              
              <div className="space-y-4">
                {beneficiariesList.map((ben, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between text-left">
                    <div className="space-y-1">
                      <span className="font-bold text-neutral-dark text-sm block leading-tight">{ben.name}</span>
                      <span className="text-xxs text-neutral-muted block font-semibold">{ben.relationship}</span>
                    </div>
                    <span className="text-base font-black text-primary-brand bg-primary-brand/5 border border-primary-brand/10 px-2.5 py-1 rounded-xl">
                      {ben.percentage}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Informative advice */}
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl flex gap-3 text-xxs text-neutral-muted leading-relaxed">
                <Info className="h-5 w-5 text-primary-brand shrink-0 mt-0.5" />
                <p>
                  Para modificar beneficiarios o porcentajes, es necesario presentar el acta civil oficial correspondiente mediante una solicitud de cambio.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal: Solicitar Actualización de Perfil */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="bg-primary-deep text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-accent-tech" />
                <span>Solicitud de Actualización</span>
              </h3>
              <button 
                onClick={() => setIsUpdateModalOpen(false)} 
                className="p-1 rounded-lg hover:bg-white/10 text-white focus-visible:outline-none cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleProcessRequest} className="p-6 space-y-6 text-left">
              {requestSubmitted ? (
                <div className="p-4 bg-success-trust/10 border border-success-trust/30 text-success-trust rounded-xl flex gap-3 text-base">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <div>
                    <span className="block font-bold">Solicitud Registrada</span>
                    <p className="text-base font-semibold leading-relaxed">
                      Su ticket de cambio de perfil ha sido ingresado al sistema. Un analista revisará y validará sus modificaciones.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-primary-brand/5 border border-primary-brand/10 rounded-2xl flex gap-3 text-xs text-neutral-muted leading-relaxed mb-2">
                    <Info className="h-5.5 w-5.5 text-primary-brand shrink-0 mt-0.5" />
                    <p>
                      Por motivos de auditoría externa y seguridad fiscal, los cambios a los datos personales (CURP, RFC, Nombre) o distribución de beneficiarios requieren validación documental de nuestro departamento de afiliaciones.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="request-text" className="block text-base font-bold text-neutral-dark">Actualizaciones Solicitadas</label>
                    <textarea
                      id="request-text"
                      required
                      rows={4}
                      value={requestText}
                      onChange={(e) => setRequestText(e.target.value)}
                      placeholder="Ej: Solicito cambiar mi número de teléfono a 55-9876-5432 y corregir el porcentaje de beneficiario a María de Lourdes a 60%..."
                      className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-medium focus:border-primary-brand focus-visible:outline-none placeholder-gray-400"
                    />
                  </div>
                </>
              )}

              {/* Footer */}
              {!requestSubmitted && (
                <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 flex justify-end gap-3 mt-8">
                  <Button
                    variant="light"
                    className="py-2.5 px-4 text-base"
                    onClick={() => setIsUpdateModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="py-2.5 px-6 text-base"
                  >
                    Enviar Solicitud
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
