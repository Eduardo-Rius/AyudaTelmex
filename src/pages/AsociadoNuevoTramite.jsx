import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, ShieldCheck, Download, Upload, AlertCircle, FileText, ChevronRight, ChevronLeft, UserPlus, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import PrivateHeader from '../components/layout/PrivateHeader';
import Footer from '../components/layout/Footer';
import Timeline from '../components/common/Timeline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { LOGGED_IN_USER } from '../data/mockData';

export default function AsociadoNuevoTramite() {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [downloadedDoc, setDownloadedDoc] = useState(false);
  const [files, setFiles] = useState({});
  const [completed, setCompleted] = useState(false);
  const [newTramiteId, setNewTramiteId] = useState('');

  // 1. Prestamo State
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPlazo, setLoanPlazo] = useState('12');

  // 2. Beneficiarios State
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [newBenName, setNewBenName] = useState('');
  const [newBenRelationship, setNewBenRelationship] = useState('Hijo/a');
  const [newBenPercentage, setNewBenPercentage] = useState('');

  // 3. Actualizacion State
  const [phone, setPhone] = useState('55-1234-5678');
  const [email, setEmail] = useState('eduardo.rius@gmail.com');
  const [address, setAddress] = useState('Av. Marina Nacional 365, Col. Verónica Anzures, CDMX');

  // 4. Retiro State
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('Emergencia Médica');
  const [withdrawalDetail, setWithdrawalDetail] = useState('');

  // Configuration map for types
  const config = {
    'prestamo': {
      title: 'Solicitud de Préstamo Mutualista',
      description: 'Obtenga financiamiento preferencial con cargo a sus cuotas acumuladas (Tasa 6% anual).',
      maxPercent: 0.8,
      limitText: '80% de su fondo acumulado',
      steps: [
        { title: 'Simulación', description: 'Defina monto y plazos' },
        { title: 'Pagaré', description: 'Descarga de pagaré oficial' },
        { title: 'Carga', description: 'Carga de pagaré y nómina' }
      ]
    },
    'beneficiarios': {
      title: 'Cambio de Beneficiarios',
      description: 'Actualice las personas y porcentajes asignados en su póliza de ayuda mutua.',
      steps: [
        { title: 'Definición', description: 'Asigne nuevos beneficiarios' },
        { title: 'Descarga', description: 'Descarga de solicitud oficial' },
        { title: 'Carga', description: 'Carga de formato firmado e INE' }
      ]
    },
    'actualizacion': {
      title: 'Actualización de Datos de Contacto',
      description: 'Modifique su teléfono, correo electrónico o domicilio registrado.',
      steps: [
        { title: 'Formulario', description: 'Modificar campos de contacto' },
        { title: 'Descarga', description: 'Descarga de solicitud firmada' },
        { title: 'Carga', description: 'Carga de formato y comprobante' }
      ]
    },
    'retiro-parcial': {
      title: 'Solicitud de Retiro Parcial de Emergencia',
      description: 'Retire hasta el 30% de sus cuotas acumuladas por causas de fuerza mayor comprobables.',
      maxPercent: 0.3,
      limitText: '30% de su fondo acumulado',
      steps: [
        { title: 'Monto y Motivo', description: 'Defina importe y emergencia' },
        { title: 'Descarga', description: 'Descarga de formato oficial' },
        { title: 'Carga', description: 'Carga de formato y evidencia' }
      ]
    }
  };

  const currentConfig = config[tipo] || null;

  // Initialize beneficiaries
  useEffect(() => {
    if (tipo === 'beneficiarios' && LOGGED_IN_USER.beneficiaries) {
      setBeneficiaries([...LOGGED_IN_USER.beneficiaries]);
    }
  }, [tipo]);

  if (!currentConfig) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-bg">
        <PrivateHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-650 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary-deep mb-2">Trámite no válido</h3>
            <p className="text-neutral-muted mb-6">El tipo de trámite solicitado no existe en la plataforma.</p>
            <Link to="/asociado/dashboard">
              <Button variant="primary">Volver al Dashboard</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const accumulated = LOGGED_IN_USER.accumulatedCuotas; // $85,420.00
  const maxLoan = accumulated * 0.8; // $68,336.00
  const maxWithdrawal = accumulated * 0.3; // $25,626.00

  // Calculations for Loan
  const calcLoanInterest = () => {
    const p = parseFloat(loanAmount) || 0;
    const n = parseInt(loanPlazo) || 12;
    // 6% annual rate. n is quincenas. Months = n / 2.
    // Interest = Principal * (0.06 * (n / 24))
    return p * 0.06 * (n / 24);
  };
  const loanInterest = calcLoanInterest();
  const loanTotal = (parseFloat(loanAmount) || 0) + loanInterest;
  const loanCuota = parseInt(loanPlazo) > 0 ? loanTotal / parseInt(loanPlazo) : 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
  };

  // Step Validation logic
  const isStepValid = () => {
    if (currentStep === 0) {
      if (tipo === 'prestamo') {
        const amt = parseFloat(loanAmount);
        return amt > 0 && amt <= maxLoan;
      }
      if (tipo === 'beneficiarios') {
        const totalPct = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
        return beneficiaries.length > 0 && totalPct === 100;
      }
      if (tipo === 'actualizacion') {
        return phone.trim() !== '' && email.trim() !== '' && address.trim() !== '';
      }
      if (tipo === 'retiro-parcial') {
        const amt = parseFloat(withdrawalAmount);
        return amt > 0 && amt <= maxWithdrawal && withdrawalDetail.trim() !== '';
      }
    }
    if (currentStep === 1) {
      return downloadedDoc;
    }
    return true;
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (currentStep === 0) {
        if (tipo === 'prestamo') {
          toast.error(`Ingrese un monto válido menor o igual a ${formatCurrency(maxLoan)}`);
        } else if (tipo === 'beneficiarios') {
          const totalPct = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
          toast.error(`La suma de porcentajes debe ser exactamente 100%. Actual: ${totalPct}%`);
        } else if (tipo === 'retiro-parcial') {
          toast.error(`Ingrese un monto válido menor o igual a ${formatCurrency(maxWithdrawal)} y detalle el motivo.`);
        } else {
          toast.error('Por favor complete todos los campos requeridos.');
        }
      } else if (currentStep === 1) {
        toast.warning('Debe descargar el documento oficial antes de continuar.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Beneficiary Management
  const addBeneficiary = () => {
    if (!newBenName.trim()) {
      toast.error('Ingrese el nombre completo del beneficiario.');
      return;
    }
    const pct = parseInt(newBenPercentage) || 0;
    if (pct <= 0 || pct > 100) {
      toast.error('Ingrese un porcentaje válido entre 1% y 100%.');
      return;
    }
    
    const currentTotal = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
    if (currentTotal + pct > 100) {
      toast.error(`Excede el 100%. Solo puede asignar hasta ${100 - currentTotal}%.`);
      return;
    }

    setBeneficiaries(prev => [...prev, {
      name: newBenName,
      relationship: newBenRelationship,
      percentage: pct
    }]);

    setNewBenName('');
    setNewBenPercentage('');
    toast.success('Beneficiario agregado.');
  };

  const removeBeneficiary = (index) => {
    setBeneficiaries(prev => prev.filter((_, i) => i !== index));
    toast.info('Beneficiario removido.');
  };

  // Document Uploads
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file.name }));
      toast.success(`Archivo "${file.name}" cargado exitosamente.`);
    }
  };

  // PDF Generators using jsPDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const primaryColor = '#003B5C';
    const secondaryColor = '#005B96';
    const today = new Date();
    const dateStr = `${today.getDate()} de ${today.toLocaleString('es-MX', { month: 'long' })} de ${today.getFullYear()}`;
    
    // Header Decorator
    doc.setFillColor(0, 59, 92); // primaryColor
    doc.rect(0, 0, 210, 15, 'F');
    
    // Title
    doc.setTextColor(0, 59, 92);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    
    if (tipo === 'prestamo') {
      doc.text("PAGARÉ MUTUALISTA", 15, 30);
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Fecha de Emisión: ${dateStr}`, 15, 36);
      doc.text(`ID Trámite: SIM-PRESTAMO-${Math.floor(1000 + Math.random() * 9000)}`, 15, 41);

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 46, 195, 46);

      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.setFont('Helvetica', 'bold');
      doc.text("DATOS DEL ASOCIADO DEUDOR:", 15, 55);
      
      doc.setFont('Helvetica', 'normal');
      doc.text(`Nombre: ${LOGGED_IN_USER.name}`, 15, 62);
      doc.text(`Número de Asociado: ${LOGGED_IN_USER.id}`, 15, 68);
      doc.text(`Empresa Depositaria: ${LOGGED_IN_USER.company}`, 15, 74);

      doc.setFont('Helvetica', 'bold');
      doc.text("DETALLES DEL CRÉDITO MUTUALISTA:", 15, 87);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Monto del Préstamo: ${formatCurrency(loanAmount)} M.N.`, 15, 94);
      doc.text(`Tasa de Interés: 6.00% anual preferencial`, 15, 100);
      doc.text(`Plazo de Amortización: ${loanPlazo} Quincenas`, 15, 106);
      doc.text(`Interés Total Calculado: ${formatCurrency(loanInterest)} M.N.`, 15, 112);
      doc.text(`Monto Total a Pagar: ${formatCurrency(loanTotal)} M.N.`, 15, 118);
      doc.text(`Importe de Descuento Quincenal: ${formatCurrency(loanCuota)} M.N.`, 15, 124);

      // Body note
      doc.setFont('Helvetica', 'bold');
      doc.text("PAGARÉ INCONDICIONAL:", 15, 137);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      const pagarText = `Por el presente pagaré, yo, ${LOGGED_IN_USER.name}, prometo y me obligo incondicionalmente a pagar a la orden de AYUDA MUTUA TELMEX, A.C., en sus oficinas corporativas, la cantidad total de ${formatCurrency(loanTotal)} (incluyendo capital e intereses preferenciales del 6% anual). Dicho pago se realizará mediante retenciones quincenales autorizadas de mi nómina por la cantidad de ${formatCurrency(loanCuota)} durante un plazo de ${loanPlazo} quincenas consecutivas.`;
      
      const splitText = doc.splitTextToSize(pagarText, 180);
      doc.text(splitText, 15, 143);

      doc.setFontSize(12);
      doc.text("Firma de Conformidad del Asociado:", 15, 185);
      doc.line(15, 210, 95, 210);
      doc.setFontSize(10);
      doc.text(LOGGED_IN_USER.name, 15, 215);
      doc.text(`Asociado ID: ${LOGGED_IN_USER.id}`, 15, 220);
      doc.text(`Firma Digital Certificada vía Portal`, 15, 225);

      doc.setFontSize(11);
      doc.setFont('Helvetica', 'bold');
      doc.text("AVISO IMPORTANTE:", 15, 245);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.text("Este documento representa una obligación legal de pago y es requisito indispensable para la transferencia de fondos.", 15, 251);
      
      doc.save(`Pagare_Mutualista_${LOGGED_IN_USER.id}.pdf`);
    } 
    else if (tipo === 'beneficiarios') {
      doc.text("SOLICITUD DE MODIFICACIÓN DE BENEFICIARIOS", 15, 30);
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Fecha de Emisión: ${dateStr}`, 15, 36);

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 46, 195, 46);

      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.setFont('Helvetica', 'bold');
      doc.text("DATOS DE AFILIACIÓN DEL ASOCIADO:", 15, 55);
      
      doc.setFont('Helvetica', 'normal');
      doc.text(`Nombre del Asociado: ${LOGGED_IN_USER.name}`, 15, 62);
      doc.text(`ID de Nómina: ${LOGGED_IN_USER.id}`, 15, 68);
      doc.text(`Empresa Laboral: ${LOGGED_IN_USER.company}`, 15, 74);

      doc.setFont('Helvetica', 'bold');
      doc.text("NUEVA DISTRIBUCIÓN DE BENEFICIARIOS (SUMA 100%):", 15, 87);
      doc.setFont('Helvetica', 'normal');
      
      let startY = 94;
      beneficiaries.forEach((b, idx) => {
        doc.text(`${idx + 1}. Nombre: ${b.name}`, 15, startY);
        doc.text(`Parentesco: ${b.relationship} | Porcentaje: ${b.percentage}%`, 35, startY + 6);
        startY += 16;
      });

      doc.setFontSize(10);
      const clausula = "Por medio de la presente, el asociado solicita formalmente al Comité de Fideicomiso de Ayuda Mutua la sustitución y revocación de los beneficiarios anteriormente registrados en su póliza de seguro de vida y fondo mutualista, asignando en su lugar a las personas arriba enlistadas con los porcentajes descritos.";
      const splitClausula = doc.splitTextToSize(clausula, 180);
      doc.text(splitClausula, 15, startY + 10);

      doc.setFontSize(12);
      doc.text("Firma del Asociado Titular:", 15, startY + 50);
      doc.line(15, startY + 70, 95, startY + 70);
      doc.setFontSize(10);
      doc.text(LOGGED_IN_USER.name, 15, startY + 75);
      
      doc.save(`Cambio_Beneficiarios_${LOGGED_IN_USER.id}.pdf`);
    }
    else if (tipo === 'actualizacion') {
      doc.text("SOLICITUD DE ACTUALIZACIÓN DE DATOS DE CONTACTO", 15, 30);
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Fecha de Emisión: ${dateStr}`, 15, 36);

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 46, 195, 46);

      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.setFont('Helvetica', 'bold');
      doc.text("DATOS DE AFILIACIÓN DEL ASOCIADO:", 15, 55);
      
      doc.setFont('Helvetica', 'normal');
      doc.text(`Nombre del Asociado: ${LOGGED_IN_USER.name}`, 15, 62);
      doc.text(`ID de Nómina: ${LOGGED_IN_USER.id}`, 15, 68);

      doc.setFont('Helvetica', 'bold');
      doc.text("NUEVOS DATOS A REGISTRAR:", 15, 87);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Teléfono Nuevo: ${phone}`, 15, 94);
      doc.text(`Correo Electrónico Nuevo: ${email}`, 15, 100);
      
      const splitAddress = doc.splitTextToSize(`Domicilio Nuevo: ${address}`, 180);
      doc.text(splitAddress, 15, 106);

      doc.setFontSize(10);
      doc.text("Solicito la actualización formal de mis datos de contacto en el sistema del Fideicomiso. Manifiesto que esta información es verídica y para comprobar el domicilio adjunto el comprobante oficial correspondiente.", 15, 130);

      doc.setFontSize(12);
      doc.text("Firma del Asociado:", 15, 160);
      doc.line(15, 185, 95, 185);
      doc.setFontSize(10);
      doc.text(LOGGED_IN_USER.name, 15, 190);

      doc.save(`Actualizacion_Datos_${LOGGED_IN_USER.id}.pdf`);
    }
    else if (tipo === 'retiro-parcial') {
      doc.text("SOLICITUD DE RETIRO PARCIAL POR EMERGENCIA", 15, 30);
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Fecha de Emisión: ${dateStr}`, 15, 36);

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 46, 195, 46);

      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.setFont('Helvetica', 'bold');
      doc.text("DATOS DEL ASOCIADO TITULAR:", 15, 55);
      
      doc.setFont('Helvetica', 'normal');
      doc.text(`Nombre del Asociado: ${LOGGED_IN_USER.name}`, 15, 62);
      doc.text(`ID de Nómina: ${LOGGED_IN_USER.id}`, 15, 68);
      doc.text(`Fondo Acumulado Actual: ${formatCurrency(accumulated)} M.N.`, 15, 74);

      doc.setFont('Helvetica', 'bold');
      doc.text("DETALLES DE LA SOLICITUD DE RETIRO:", 15, 87);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Monto de Retiro Parcial: ${formatCurrency(withdrawalAmount)} M.N.`, 15, 94);
      doc.text(`Porcentaje del Fondo Solicitado: ${((parseFloat(withdrawalAmount) / accumulated) * 100).toFixed(2)}% (Límite: 30%)`, 15, 100);
      doc.text(`Motivo de Emergencia: ${withdrawalReason}`, 15, 106);
      
      const splitDetail = doc.splitTextToSize(`Detalle/Declaración: ${withdrawalDetail}`, 180);
      doc.text(splitDetail, 15, 112);

      doc.setFontSize(10);
      doc.text("Por medio del presente documento, declaro bajo protesta de decir verdad que sufro una situación de fuerza mayor o emergencia y requiero el retiro parcial anticipado de mis cuotas acumuladas. Acepto que dicho importe se deducirá de mi saldo acumulado del Fideicomiso.", 15, 145);

      doc.setFontSize(12);
      doc.text("Firma del Asociado:", 15, 180);
      doc.line(15, 205, 95, 205);
      doc.setFontSize(10);
      doc.text(LOGGED_IN_USER.name, 15, 210);

      doc.save(`Retiro_Parcial_${LOGGED_IN_USER.id}.pdf`);
    }

    setDownloadedDoc(true);
    toast.success('Documento PDF oficial generado y descargado.');
  };

  // Submit and save to BPM localStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check files uploaded
    if (tipo === 'actualizacion') {
      if (!files.addressProof) {
        toast.warning('Por favor suba su Comprobante de Domicilio.');
        return;
      }
    } else if (tipo === 'prestamo') {
      if (!files.pagare || !files.receipt) {
        toast.warning('Debe subir tanto el Pagaré firmado como su Recibo de Nómina.');
        return;
      }
    } else if (tipo === 'beneficiarios') {
      if (!files.form || !files.ine) {
        toast.warning('Debe subir el Formulario firmado y su Identificación Oficial.');
        return;
      }
    } else if (tipo === 'retiro-parcial') {
      if (!files.form || !files.evidence) {
        toast.warning('Debe subir el Formulario firmado y la Evidencia médica/emergencia.');
        return;
      }
    }

    const newId = `TR-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const timeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    // Get amount if applicable
    let amountVal = null;
    if (tipo === 'prestamo') amountVal = parseFloat(loanAmount);
    if (tipo === 'retiro-parcial') amountVal = parseFloat(withdrawalAmount);

    // Build custom payload to update profiles upon approval
    let customDetails = {};
    if (tipo === 'beneficiarios') {
      customDetails = { beneficiaries };
    } else if (tipo === 'actualizacion') {
      customDetails = { phone, email, address };
    }

    const newClaim = {
      id: newId,
      name: LOGGED_IN_USER.name,
      type: currentConfig.title,
      amount: amountVal,
      status: "Recibido",
      date: dateStr,
      startDate: dateStr,
      logs: [
        { date: `${dateStr} ${timeStr}`, message: "Solicitud iniciada e ingresada al buzón digital por el asociado." }
      ],
      details: customDetails
    };

    // 1. Save to associate list
    const asocStored = localStorage.getItem('ayudatelmex_asoc_tramites');
    let asocList = [];
    if (asocStored) {
      asocList = JSON.parse(asocStored);
    } else {
      // Fallback initially
      asocList = [...LOGGED_IN_USER.activeTramites, ...LOGGED_IN_USER.completedTramites];
    }
    asocList.unshift(newClaim);
    localStorage.setItem('ayudatelmex_asoc_tramites', JSON.stringify(asocList));

    // 2. Save to admin list
    const adminStored = localStorage.getItem('ayudatelmex_admin_tramites');
    let adminList = [];
    if (adminStored) {
      adminList = JSON.parse(adminStored);
    } else {
      // Import the static recent list
      const { RECENT_TRAMITES } = require('../data/mockData');
      adminList = [...RECENT_TRAMITES];
    }
    // Convert to mock format for admin if needed
    adminList.unshift({
      id: newClaim.id,
      name: newClaim.name,
      type: newClaim.type,
      amount: newClaim.amount,
      status: newClaim.status,
      date: newClaim.date,
      startDate: newClaim.startDate,
      logs: newClaim.logs,
      details: newClaim.details
    });
    localStorage.setItem('ayudatelmex_admin_tramites', JSON.stringify(adminList));

    setNewTramiteId(newId);
    setCompleted(true);
    toast.success(`Trámite ${newId} registrado con éxito en el motor BPM.`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <PrivateHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Link */}
        <div className="mb-6 text-left">
          <Link to="/asociado/dashboard" className="inline-flex items-center gap-2 text-primary-brand hover:text-primary-deep font-bold text-base focus-visible:outline-none">
            <ArrowLeft className="h-4 w-4" /> Volver a Mi Resumen
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-left mb-8">
          <span className="px-3 py-1 bg-primary-brand/5 text-primary-brand text-xs font-black rounded-full uppercase tracking-wider border border-primary-brand/10">
            Trámites Digitales BPM
          </span>
          <h2 className="text-3xl font-extrabold text-primary-deep tracking-tight mt-2">{currentConfig.title}</h2>
          <p className="text-base text-neutral-muted mt-1">{currentConfig.description}</p>
        </div>

        {!completed ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Steps & Form (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Steps Indicator */}
              <Card className="py-4">
                <Timeline steps={currentConfig.steps} currentStep={currentStep} />
              </Card>

              {/* Wizard Body Card */}
              <Card>
                {/* STEP 0: Simulación / Datos */}
                {currentStep === 0 && (
                  <div className="space-y-6 text-left animate-fade-in">
                    <div className="border-b border-gray-150 pb-4 mb-4">
                      <h3 className="text-xl font-bold text-primary-deep">Paso 1: Configurar Datos de Solicitud</h3>
                      <p className="text-sm text-neutral-muted mt-1">Defina los detalles e importes requeridos para su trámite.</p>
                    </div>

                    {/* Loan Flow Form */}
                    {tipo === 'prestamo' && (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label htmlFor="loan-amount" className="block text-base font-bold text-neutral-dark">Monto Solicitado (MXN)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-lg font-black text-gray-500">$</span>
                            <input
                              id="loan-amount"
                              type="number"
                              required
                              placeholder="Ej: 30000"
                              value={loanAmount}
                              onChange={(e) => setLoanAmount(e.target.value)}
                              className="block w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl text-lg font-bold focus:border-primary-brand focus:ring-1 focus:ring-primary-brand"
                            />
                          </div>
                          <span className="block text-xs text-neutral-muted font-bold">
                            Fondo Acumulado: {formatCurrency(accumulated)} | Límite Máximo Préstamo (80%): {formatCurrency(maxLoan)}
                          </span>
                          
                          {/* Limit check alert */}
                          {parseFloat(loanAmount) > maxLoan && (
                            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex gap-2.5 text-xs font-bold leading-normal">
                              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                              <p>El monto solicitado supera el límite permitido de {formatCurrency(maxLoan)} (80% de su fondo acumulado).</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="loan-plazo" className="block text-base font-bold text-neutral-dark">Plazo de Pago (Quincenas)</label>
                          <select
                            id="loan-plazo"
                            value={loanPlazo}
                            onChange={(e) => setLoanPlazo(e.target.value)}
                            className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-semibold bg-white"
                          >
                            <option value="12">12 Quincenas (~6 Meses)</option>
                            <option value="18">18 Quincenas (~9 Meses)</option>
                            <option value="24">24 Quincenas (~12 Meses)</option>
                          </select>
                        </div>

                        {/* Loan simulation details card */}
                        {parseFloat(loanAmount) > 0 && parseFloat(loanAmount) <= maxLoan && (
                          <div className="bg-primary-deep/5 border border-primary-brand/10 p-5 rounded-2xl space-y-3">
                            <h4 className="text-base font-bold text-primary-deep flex items-center gap-2">
                              <ShieldCheck className="h-5 w-5 text-primary-brand" />
                              <span>Simulación de Pagos Quincenales</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                              <div>
                                <span className="block text-xxs font-bold text-neutral-muted uppercase">Monto de Capital</span>
                                <span className="block text-lg font-black text-neutral-dark">{formatCurrency(parseFloat(loanAmount))}</span>
                              </div>
                              <div>
                                <span className="block text-xxs font-bold text-neutral-muted uppercase">Intereses (6% anual)</span>
                                <span className="block text-lg font-black text-success-trust">+{formatCurrency(loanInterest)}</span>
                              </div>
                              <div>
                                <span className="block text-xxs font-bold text-neutral-muted uppercase">Total a Pagar</span>
                                <span className="block text-lg font-black text-neutral-dark">{formatCurrency(loanTotal)}</span>
                              </div>
                              <div>
                                <span className="block text-xxs font-bold text-neutral-muted uppercase">Pago Quincenal Estimado</span>
                                <span className="block text-xl font-black text-primary-brand">{formatCurrency(loanCuota)} / quincena</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Beneficiaries Flow Form */}
                    {tipo === 'beneficiarios' && (
                      <div className="space-y-6">
                        <div className="space-y-4 bg-gray-50 border border-gray-150 p-5 rounded-2xl">
                          <h4 className="text-base font-bold text-primary-deep">Agregar Nuevo Beneficiario</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1 sm:col-span-2">
                              <label htmlFor="ben-name" className="block text-xs font-bold text-neutral-muted uppercase">Nombre Completo</label>
                              <input
                                id="ben-name"
                                type="text"
                                placeholder="Nombre completo..."
                                value={newBenName}
                                onChange={(e) => setNewBenName(e.target.value)}
                                className="block w-full border-2 border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold focus:border-primary-brand"
                              />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor="ben-relationship" className="block text-xs font-bold text-neutral-muted uppercase">Parentesco</label>
                              <select
                                id="ben-relationship"
                                value={newBenRelationship}
                                onChange={(e) => setNewBenRelationship(e.target.value)}
                                className="block w-full border-2 border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold bg-white"
                              >
                                <option value="Esposa/o">Esposa/o</option>
                                <option value="Hijo/a">Hijo/a</option>
                                <option value="Madre/Padre">Madre/Padre</option>
                                <option value="Hermano/a">Hermano/a</option>
                                <option value="Otro">Otro</option>
                              </select>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <label htmlFor="ben-pct" className="block text-xs font-bold text-neutral-muted uppercase">Porcentaje de Asignación (%)</label>
                              <input
                                id="ben-pct"
                                type="number"
                                placeholder="Ej: 25"
                                value={newBenPercentage}
                                onChange={(e) => setNewBenPercentage(e.target.value)}
                                className="block w-full border-2 border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold focus:border-primary-brand"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button
                                variant="primary"
                                onClick={addBeneficiary}
                                className="w-full py-2.5 px-4 text-sm min-h-0 flex gap-1.5"
                              >
                                <UserPlus className="h-4 w-4" />
                                <span>Agregar</span>
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Beneficiaries List */}
                        <div className="space-y-3">
                          <h4 className="text-base font-bold text-primary-deep">Distribución de Porcentajes</h4>
                          
                          <div className="space-y-2">
                            {beneficiaries.map((b, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300">
                                <div className="space-y-0.5">
                                  <span className="font-bold text-neutral-dark text-sm block leading-tight">{b.name}</span>
                                  <span className="text-xxs text-neutral-muted block font-semibold">{b.relationship}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-black text-primary-brand bg-primary-brand/5 border border-primary-brand/10 px-2.5 py-1 rounded-xl">
                                    {b.percentage}%
                                  </span>
                                  <button
                                    onClick={() => removeBeneficiary(idx)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                    title="Remover beneficiario"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {beneficiaries.length === 0 && (
                              <p className="text-sm text-neutral-muted italic text-center py-4">No se han registrado beneficiarios. Agregue al menos uno.</p>
                            )}
                          </div>

                          {/* Percent validation banner */}
                          {beneficiaries.length > 0 && (
                            <div className="flex justify-between items-center p-4 rounded-xl border font-bold text-sm bg-gray-50 border-gray-200">
                              <span className="text-neutral-dark">Total Asignado:</span>
                              {(() => {
                                const total = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
                                if (total === 100) {
                                  return <span className="text-success-trust font-black">✓ 100% (Correcto)</span>;
                                }
                                return <span className="text-warning-alert font-black">⚠ {total}% (Debe ser exactamente 100%)</span>;
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact details Form */}
                    {tipo === 'actualizacion' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label htmlFor="act-phone" className="block text-base font-bold text-neutral-dark">Teléfono Celular Nuevo</label>
                          <input
                            id="act-phone"
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="act-email" className="block text-base font-bold text-neutral-dark">Correo Electrónico Nuevo</label>
                          <input
                            id="act-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="act-address" className="block text-base font-bold text-neutral-dark">Domicilio Nuevo Completo</label>
                          <textarea
                            id="act-address"
                            required
                            rows={3}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-semibold"
                          />
                        </div>
                      </div>
                    )}

                    {/* Withdrawal flow Form */}
                    {tipo === 'retiro-parcial' && (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label htmlFor="withdrawal-amount" className="block text-base font-bold text-neutral-dark">Monto de Retiro Parcial (MXN)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-lg font-black text-gray-500">$</span>
                            <input
                              id="withdrawal-amount"
                              type="number"
                              required
                              placeholder="Ej: 15000"
                              value={withdrawalAmount}
                              onChange={(e) => setWithdrawalAmount(e.target.value)}
                              className="block w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl text-lg font-bold focus:border-primary-brand"
                            />
                          </div>
                          <span className="block text-xs text-neutral-muted font-bold">
                            Fondo Acumulado: {formatCurrency(accumulated)} | Límite Máximo Emergencia (30%): {formatCurrency(maxWithdrawal)}
                          </span>

                          {/* Limit check alert */}
                          {parseFloat(withdrawalAmount) > maxWithdrawal && (
                            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex gap-2.5 text-xs font-bold leading-normal">
                              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                              <p>El monto solicitado supera el límite de emergencia del 30% ({formatCurrency(maxWithdrawal)}).</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="withdrawal-reason" className="block text-base font-bold text-neutral-dark">Motivo de Emergencia</label>
                          <select
                            id="withdrawal-reason"
                            value={withdrawalReason}
                            onChange={(e) => setWithdrawalReason(e.target.value)}
                            className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-semibold bg-white"
                          >
                            <option value="Emergencia Médica">Emergencia Médica</option>
                            <option value="Desastre Natural">Desastre Natural / Daños en Vivienda</option>
                            <option value="Reparación Estructural Urgente">Reparación Estructural Urgente</option>
                            <option value="Gastos Funerarios Directos">Gastos Funerarios Directos</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="withdrawal-detail" className="block text-base font-bold text-neutral-dark">Detalle o Explicación del Suceso</label>
                          <textarea
                            id="withdrawal-detail"
                            required
                            rows={3}
                            placeholder="Describa brevemente la situación de emergencia..."
                            value={withdrawalDetail}
                            onChange={(e) => setWithdrawalDetail(e.target.value)}
                            className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-semibold"
                          />
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-end pt-6 border-t border-gray-100">
                      <Button
                        variant="primary"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className="gap-2"
                      >
                        <span>Continuar</span>
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 1: PDF Generation */}
                {currentStep === 1 && (
                  <div className="space-y-6 text-left animate-fade-in">
                    <div className="border-b border-gray-150 pb-4 mb-4">
                      <h3 className="text-xl font-bold text-primary-deep">Paso 2: Descargar Documento Oficial</h3>
                      <p className="text-sm text-neutral-muted mt-1">Descargue la solicitud firmada digitalmente para su archivo e impresión.</p>
                    </div>

                    <div className="p-6 bg-primary-deep/5 border border-primary-brand/20 rounded-2xl space-y-4">
                      <h4 className="text-lg font-bold text-primary-deep">Generar Copia Digital Autógrafa</h4>
                      <p className="text-sm text-neutral-muted leading-relaxed">
                        Es indispensable descargar el PDF de la solicitud. Este archivo contiene las cláusulas correspondientes de aceptación, el folio de registro del motor BPM y los sellos de seguridad digital.
                      </p>
                      
                      <div className="flex items-center gap-4 flex-col sm:flex-row pt-2">
                        <Button
                          variant="secondary"
                          onClick={generatePDF}
                          className="gap-2 w-full sm:w-auto"
                        >
                          <Download className="h-5 w-5" />
                          <span>Descargar Formato Oficial PDF</span>
                        </Button>
                        
                        {downloadedDoc && (
                          <span className="text-success-trust font-bold flex items-center gap-1.5 animate-bounce text-sm">
                            <CheckCircle2 className="h-5 w-5" /> Descargado correctamente
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t border-gray-100">
                      <Button variant="light" onClick={handleBack} className="gap-2">
                        <ChevronLeft className="h-5 w-5" />
                        <span>Atrás</span>
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleNext}
                        disabled={!downloadedDoc}
                        className="gap-2"
                      >
                        <span>Continuar</span>
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Upload Files and Submit */}
                {currentStep === 2 && (
                  <div className="space-y-6 text-left animate-fade-in">
                    <div className="border-b border-gray-150 pb-4 mb-4">
                      <h3 className="text-xl font-bold text-primary-deep">Paso 3: Cargar Expediente del Trámite</h3>
                      <p className="text-sm text-neutral-muted mt-1">Suba las copias digitales requeridas para iniciar la revisión.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* Document 1 depending on tipo */}
                      {tipo === 'prestamo' && (
                        <div className="space-y-3">
                          <label className="block text-base font-bold text-primary-deep">1. Pagaré Mutualista Firmado</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(e, 'pagare')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="h-7 w-7 text-gray-400" />
                              <span className="text-sm font-bold text-primary-brand">Seleccione o arrastre el Pagaré PDF</span>
                              <span className="text-xxs text-neutral-muted">Formatos: PDF, JPG, PNG. Max 5MB</span>
                            </div>
                          </div>
                          {files.pagare && (
                            <div className="p-2.5 bg-success-trust/10 text-success-trust border border-success-trust/20 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <FileText className="h-4.5 w-4.5" />
                              <span>Cargado: {files.pagare}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {tipo === 'beneficiarios' && (
                        <div className="space-y-3">
                          <label className="block text-base font-bold text-primary-deep">1. Formulario de Solicitud Firmado</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(e, 'form')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="h-7 w-7 text-gray-400" />
                              <span className="text-sm font-bold text-primary-brand">Seleccione o arrastre la Solicitud firmada</span>
                            </div>
                          </div>
                          {files.form && (
                            <div className="p-2.5 bg-success-trust/10 text-success-trust border border-success-trust/20 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <FileText className="h-4.5 w-4.5" />
                              <span>Cargado: {files.form}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {tipo === 'actualizacion' && (
                        <div className="space-y-3">
                          <label className="block text-base font-bold text-primary-deep">1. Solicitud de Datos Firmada</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(e, 'form')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="h-7 w-7 text-gray-400" />
                              <span className="text-sm font-bold text-primary-brand">Seleccione o arrastre la Solicitud firmada</span>
                            </div>
                          </div>
                          {files.form && (
                            <div className="p-2.5 bg-success-trust/10 text-success-trust border border-success-trust/20 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <FileText className="h-4.5 w-4.5" />
                              <span>Cargado: {files.form}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {tipo === 'retiro-parcial' && (
                        <div className="space-y-3">
                          <label className="block text-base font-bold text-primary-deep">1. Solicitud de Retiro Parcial Firmada</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(e, 'form')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="h-7 w-7 text-gray-400" />
                              <span className="text-sm font-bold text-primary-brand">Seleccione o arrastre la Solicitud firmada</span>
                            </div>
                          </div>
                          {files.form && (
                            <div className="p-2.5 bg-success-trust/10 text-success-trust border border-success-trust/20 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <FileText className="h-4.5 w-4.5" />
                              <span>Cargado: {files.form}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Document 2 depending on tipo */}
                      {tipo === 'prestamo' && (
                        <div className="space-y-3">
                          <label className="block text-base font-bold text-primary-deep">2. Último Recibo de Nómina</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(e, 'receipt')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="h-7 w-7 text-gray-400" />
                              <span className="text-sm font-bold text-primary-brand">Cargar Recibo de Nómina</span>
                            </div>
                          </div>
                          {files.receipt && (
                            <div className="p-2.5 bg-success-trust/10 text-success-trust border border-success-trust/20 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <FileText className="h-4.5 w-4.5" />
                              <span>Cargado: {files.receipt}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {tipo === 'beneficiarios' && (
                        <div className="space-y-3">
                          <label className="block text-base font-bold text-primary-deep">2. Identificación Oficial Vigente (INE/Pasaporte)</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(e, 'ine')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="h-7 w-7 text-gray-400" />
                              <span className="text-sm font-bold text-primary-brand">Cargar Identificación (Frente y Reverso)</span>
                            </div>
                          </div>
                          {files.ine && (
                            <div className="p-2.5 bg-success-trust/10 text-success-trust border border-success-trust/20 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <FileText className="h-4.5 w-4.5" />
                              <span>Cargado: {files.ine}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {tipo === 'actualizacion' && (
                        <div className="space-y-3">
                          <label className="block text-base font-bold text-primary-deep">2. Comprobante de Domicilio Nuevo (Agua/Luz/Teléfono)</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(e, 'addressProof')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="h-7 w-7 text-gray-400" />
                              <span className="text-sm font-bold text-primary-brand">Cargar Comprobante de Domicilio</span>
                            </div>
                          </div>
                          {files.addressProof && (
                            <div className="p-2.5 bg-success-trust/10 text-success-trust border border-success-trust/20 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <FileText className="h-4.5 w-4.5" />
                              <span>Cargado: {files.addressProof}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {tipo === 'retiro-parcial' && (
                        <div className="space-y-3">
                          <label className="block text-base font-bold text-primary-deep">2. Evidencia de la Situación de Emergencia</label>
                          <p className="text-xxs text-neutral-muted">Suba justificante médico, reporte de siniestro, facturas o certificado oficial.</p>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(e, 'evidence')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="h-7 w-7 text-gray-400" />
                              <span className="text-sm font-bold text-primary-brand">Cargar Evidencia Médica / Oficial</span>
                            </div>
                          </div>
                          {files.evidence && (
                            <div className="p-2.5 bg-success-trust/10 text-success-trust border border-success-trust/20 rounded-xl flex items-center gap-2 text-sm font-bold">
                              <FileText className="h-4.5 w-4.5" />
                              <span>Cargado: {files.evidence}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Navigation buttons */}
                      <div className="flex justify-between pt-6 border-t border-gray-100">
                        <Button variant="light" onClick={handleBack} className="gap-2">
                          <ChevronLeft className="h-5 w-5" />
                          <span>Atrás</span>
                        </Button>
                        <Button
                          type="submit"
                          variant="success"
                          className="gap-2"
                        >
                          <span>Enviar a Validación BPM</span>
                          <CheckCircle2 className="h-5 w-5" />
                        </Button>
                      </div>

                    </form>
                  </div>
                )}
              </Card>
            </div>

            {/* Claim Summary Card (4 cols) */}
            <div className="lg:col-span-4 text-left">
              <Card title="Resumen del Trámite">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1">
                    <span className="block text-xxs font-extrabold text-neutral-muted uppercase">Asociado</span>
                    <span className="block text-sm font-bold text-primary-deep">{LOGGED_IN_USER.name}</span>
                    <span className="block text-xxs text-neutral-muted">No. Afiliado: {LOGGED_IN_USER.id}</span>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                    <span className="block text-xxs font-extrabold text-neutral-muted uppercase">Tipo de Trámite</span>
                    <span className="block text-sm font-bold text-neutral-dark">{currentConfig.title}</span>
                  </div>

                  {tipo === 'prestamo' && loanAmount && parseFloat(loanAmount) <= maxLoan && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                      <span className="block text-xxs font-extrabold text-neutral-muted uppercase">Monto Estimado</span>
                      <span className="block text-lg font-black text-primary-brand">{formatCurrency(parseFloat(loanAmount))}</span>
                      <span className="block text-xxs text-neutral-muted">{loanPlazo} Quincenas a 6% anual</span>
                    </div>
                  )}

                  {tipo === 'retiro-parcial' && withdrawalAmount && parseFloat(withdrawalAmount) <= maxWithdrawal && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                      <span className="block text-xxs font-extrabold text-neutral-muted uppercase">Monto de Emergencia</span>
                      <span className="block text-lg font-black text-primary-brand">{formatCurrency(parseFloat(withdrawalAmount))}</span>
                      <span className="block text-xxs text-neutral-muted">Motivo: {withdrawalReason}</span>
                    </div>
                  )}

                  <div className="text-xxs text-neutral-muted bg-gray-50 p-4 border border-gray-200 rounded-2xl leading-relaxed">
                    <AlertCircle className="h-4 w-4 text-primary-brand inline mr-1 -mt-0.5" />
                    Al finalizar el envío, su trámite se registrará de manera inmediata en el motor BPM y estará visible tanto en su Dashboard como en la Consola Administrativa.
                  </div>
                </div>
              </Card>
            </div>

          </div>
        ) : (
          /* SUCCESS STATE */
          <Card className="text-center py-12 px-6 space-y-6 max-w-2xl mx-auto animate-scale-up border-t-8 border-t-success-trust">
            <div className="flex justify-center">
              <div className="bg-success-trust/10 p-6 rounded-full text-success-trust">
                <CheckCircle2 className="h-20 w-20 stroke-[2.5px]" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-extrabold text-primary-deep">¡Trámite Recibido con Éxito!</h3>
              <p className="text-base text-neutral-muted leading-relaxed">
                Su trámite con folio <span className="font-bold text-neutral-dark">{newTramiteId}</span> ha sido ingresado correctamente en el motor BPM de Ayuda Mutua TELMEX, A.C.
              </p>
            </div>
            
            <div className="bg-neutral-bg p-5 rounded-2xl border border-gray-250 text-left space-y-2 max-w-md mx-auto">
              <span className="block text-xs font-bold text-neutral-muted uppercase">Estatus del Proceso</span>
              <span className="block text-base font-bold text-primary-deep flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-warning-alert animate-ping" />
                Recibido (Pendiente de Dictamen)
              </span>
              <span className="block text-xs text-neutral-muted">El área de control y auditoría de la asociación evaluará la documentación cargada a la brevedad.</span>
            </div>

            <div className="pt-6">
              <Link to="/asociado/dashboard">
                <Button variant="primary" className="px-8">
                  Volver a Mi Resumen
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
