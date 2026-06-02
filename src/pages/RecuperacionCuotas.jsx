import React, { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Download, Upload, AlertCircle, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import PrivateHeader from '../components/layout/PrivateHeader';
import Footer from '../components/layout/Footer';
import Timeline from '../components/common/Timeline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { LOGGED_IN_USER } from '../data/mockData';
import { jsPDF } from 'jspdf';


export default function RecuperacionCuotas() {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedLetter, setGeneratedLetter] = useState(false);
  const [files, setFiles] = useState({ letter: null, id: null });
  const [completed, setCompleted] = useState(false);

  const steps = [
    { title: 'Validación', description: 'Revisión de elegibilidad' },
    { title: 'Confirmación', description: 'Montos y generación de carta' },
    { title: 'Documentos', description: 'Carga de comprobantes' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateLetter = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      // Línea decorativa superior (azul profundo de la marca)
      doc.setFillColor(0, 45, 114);
      doc.rect(20, 20, 176, 3, 'F');

      // Encabezado
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate Gray
      doc.text('FIDEICOMISO DE AYUDA MUTUA TELMEX, A.C.', 20, 30);

      // Título del documento
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // Slate oscuro
      doc.text('CARTA DE CONFORMIDAD PARA RECUPERACIÓN DE CUOTAS', 20, 45);

      // Fecha de emisión
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text('Fecha de emisión: 1 de junio de 2026', 20, 52);

      // Línea divisora
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 57, 196, 57);

      // Caja de información del asociado
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 62, 176, 45, 'F');
      
      doc.setDrawColor(226, 232, 240);
      doc.rect(20, 62, 176, 45, 'S');

      // Título de la sección de datos
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('DATOS DEL ASOCIADO', 25, 69);

      // Etiquetas y valores
      doc.setFontSize(10);
      
      // Nombre
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Nombre:', 25, 76);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Eduardo Rius Torres', 65, 76);

      // Número de asociado
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Número de Asociado:', 25, 83);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('902847', 65, 83);

      // Empresa
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Empresa:', 25, 90);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Telégrafos y Teléfonos del Noroeste, S.A. de C.V. (TELNOR)', 65, 90);

      // Monto a devolver
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Monto total a devolver:', 25, 97);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 45, 114);
      doc.text('$85,420.00 M.N.', 65, 97);

      // Textos legales
      const paragraphs = [
        'Por medio de la presente, manifiesto mi conformidad para solicitar la recuperación total de las cuotas acumuladas registradas a mi favor dentro del Fideicomiso de Ayuda Mutua TELMEX, A.C.',
        'Reconozco que el monto indicado corresponde al saldo acumulado registrado en el sistema al momento de emitir esta solicitud y acepto que la operación quede sujeta a validación administrativa, conciliación contable y autorización del Comité correspondiente.',
        'Asimismo, declaro que los datos bancarios y personales proporcionados son correctos y autorizo al Fideicomiso a realizar el proceso de revisión y transferencia correspondiente.'
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      let currentY = 115;
      paragraphs.forEach((p) => {
        const lines = doc.splitTextToSize(p, 176);
        doc.text(lines, 20, currentY);
        currentY += (lines.length * 5) + 5;
      });

      // Área de firma del Asociado
      const signatureY = 205;
      doc.setDrawColor(148, 163, 184); // Slate 400
      doc.line(70, signatureY, 146, signatureY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('Eduardo Rius Torres', 108, signatureY + 6, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Firma del Asociado', 108, signatureY + 11, { align: 'center' });

      // Sello digital en la parte inferior
      const sealY = 245;
      doc.setFillColor(248, 250, 252);
      doc.rect(20, sealY, 176, 16, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(20, sealY, 176, 16, 'S');

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Documento generado digitalmente desde el Portal de Asociados Ayuda Mutua TELMEX, A.C.', 24, sealY + 6);
      doc.text('Código de Verificación: FIDEICOMISO-902847-2026-CONFIRMACION-CUOTAS', 24, sealY + 11);

      // Guardar PDF
      doc.save('Carta_Conformidad_Recuperacion_Cuotas_902847.pdf');

      // Actualizar estado y mostrar Toast
      setGeneratedLetter(true);
      toast.success('Carta de conformidad generada correctamente.');
    } catch (error) {
      console.error('Error al generar la Carta de Conformidad en PDF:', error);
      toast.error('Ocurrió un error al generar la Carta de Conformidad.');
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files.letter || !files.id) {
      toast.warning('Por favor, suba los dos documentos requeridos para continuar.');
      return;
    }
    setCompleted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <PrivateHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Link */}
        <div className="mb-6 text-left">
          <Link to="/asociado/dashboard" className="inline-flex items-center gap-2 text-primary-brand hover:text-primary-deep font-bold text-base focus-visible:outline-none">
            <ArrowLeft className="h-4 w-4" /> Volver a Mi Resumen
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-primary-deep">Recuperación de Cuotas Acumuladas</h2>
          <p className="text-lg text-neutral-muted mt-2">
            Solicite el reembolso de sus cuotas acumuladas por retiro reglamentario.
          </p>
        </div>

        {!completed ? (
          <div className="space-y-8">
            {/* Steps Timeline Indicator */}
            <Card className="py-4">
              <Timeline steps={steps} currentStep={currentStep} />
            </Card>

            {/* Steps Content Cards */}
            <Card>
              {/* STEP 1: VALIDATION */}
              {currentStep === 0 && (
                <div className="space-y-6 text-left animate-fade-in">
                  <div className="border-b border-gray-150 pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-primary-deep">Paso 1: Validación de Elegibilidad</h3>
                    <p className="text-base text-neutral-muted mt-1">Confirmamos que cumple con los requisitos del Fideicomiso.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-bg p-6 rounded-2xl border border-gray-200">
                    <div>
                      <span className="block text-sm font-bold text-neutral-muted uppercase">Nombre del Asociado</span>
                      <span className="block text-lg font-bold text-neutral-dark">{LOGGED_IN_USER.name}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-neutral-muted uppercase">Empresa de Registro</span>
                      <span className="block text-lg font-bold text-neutral-dark">{LOGGED_IN_USER.company}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-neutral-muted uppercase">Edad del Asociado</span>
                      <span className="block text-lg font-bold text-neutral-dark">{LOGGED_IN_USER.age} años</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-neutral-muted uppercase">Estatus de Elegibilidad</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full text-base font-bold bg-success-trust/10 text-success-trust border border-success-trust/20">
                        <CheckCircle2 className="h-4 w-4" /> Disponible para Recuperación
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-primary-brand p-5 rounded-r-xl flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-primary-brand shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-primary-deep text-lg">¿Por qué es elegible?</h4>
                      <p className="text-base text-neutral-muted leading-relaxed">
                        El estatuto de Ayuda Mutua TELMEX establece que los asociados que alcanzan los {LOGGED_IN_USER.eligibleAgeRecovery} años de edad pueden solicitar la recuperación del 100% de sus cuotas aportadas voluntariamente.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button variant="primary" onClick={handleNext} className="gap-2">
                      <span>Continuar</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: CONFIRMATION */}
              {currentStep === 1 && (
                <div className="space-y-6 text-left animate-fade-in">
                  <div className="border-b border-gray-150 pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-primary-deep">Paso 2: Confirmación de Monto</h3>
                    <p className="text-base text-neutral-muted mt-1">Revise los importes acumulados y genere su carta de solicitud.</p>
                  </div>

                  <div className="p-6 bg-primary-deep/5 border border-primary-brand/20 rounded-2xl text-center space-y-4">
                    <span className="block text-base font-bold text-neutral-muted uppercase tracking-wider">Monto Total a Devolver</span>
                    <span className="block text-5xl font-black text-primary-deep">{formatCurrency(LOGGED_IN_USER.accumulatedCuotas)}</span>
                    <p className="text-base text-neutral-muted max-w-xl mx-auto">
                      Este saldo se compone de todas sus aportaciones registradas desde su afiliación al Fideicomiso.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-primary-deep">Generar Carta de Conformidad</h4>
                    <p className="text-base text-neutral-muted leading-relaxed">
                      Debe descargar y firmar de puño y letra la Carta de Conformidad. Este documento es indispensable para procesar la transferencia bancaria.
                    </p>
                    
                    <div className="flex items-center gap-4 flex-col sm:flex-row">
                      <Button
                        variant="secondary"
                        onClick={generateLetter}
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Download className="h-5 w-5" />
                        <span>Generar Carta de Conformidad</span>
                      </Button>
                      
                      {generatedLetter && (
                        <span className="text-success-trust font-bold flex items-center gap-1.5 animate-bounce">
                          <CheckCircle2 className="h-5 w-5" /> Generada con éxito
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
                      disabled={!generatedLetter}
                      className="gap-2"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: DOCUMENT UPLOAD */}
              {currentStep === 2 && (
                <div className="space-y-6 text-left animate-fade-in">
                  <div className="border-b border-gray-150 pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-primary-deep">Paso 3: Cargar Documentos</h3>
                    <p className="text-base text-neutral-muted mt-1">Cargue los archivos digitales para validar su firma e identidad.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Document 1: Carta Firmada */}
                    <div className="space-y-3">
                      <label className="block text-lg font-bold text-primary-deep">1. Carta de Conformidad Firmada</label>
                      <p className="text-sm text-neutral-muted">Suba el PDF generado en el paso anterior con su firma autógrafa.</p>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                        <input
                          type="file"
                          id="file-letter"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, 'letter')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-base font-bold text-primary-brand">Seleccione o arrastre su Carta de Conformidad</span>
                          <span className="text-xs text-neutral-muted">Formatos aceptados: PDF, JPG, PNG. Máximo 5MB.</span>
                        </div>
                      </div>
                      {files.letter && (
                        <div className="p-3 bg-success-trust/10 text-[#008f65] border border-success-trust/20 rounded-xl flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          <span className="font-bold text-base">Archivo: {files.letter}</span>
                        </div>
                      )}
                    </div>

                    {/* Document 2: ID */}
                    <div className="space-y-3">
                      <label className="block text-lg font-bold text-primary-deep">2. Identificación Oficial Vigente</label>
                      <p className="text-sm text-neutral-muted">Suba su INE, Pasaporte o Credencial de Pensionado por ambos lados.</p>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-primary-brand transition-colors bg-gray-50/50 relative">
                        <input
                          type="file"
                          id="file-id"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, 'id')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-base font-bold text-primary-brand">Seleccione o arrastre su Identificación</span>
                          <span className="text-xs text-neutral-muted">Formatos aceptados: PDF, JPG, PNG. Máximo 5MB.</span>
                        </div>
                      </div>
                      {files.id && (
                        <div className="p-3 bg-success-trust/10 text-[#008f65] border border-success-trust/20 rounded-xl flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          <span className="font-bold text-base">Archivo: {files.id}</span>
                        </div>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t border-gray-100">
                      <Button variant="light" onClick={handleBack} className="gap-2">
                        <ChevronLeft className="h-5 w-5" />
                        <span>Atrás</span>
                      </Button>
                      <Button
                        type="submit"
                        variant="success"
                        disabled={!files.letter || !files.id}
                        className="gap-2"
                      >
                        <span>Enviar Solicitud</span>
                        <CheckCircle2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
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
              <p className="text-lg text-neutral-muted leading-relaxed">
                Su solicitud de recuperación de cuotas acumuladas por la cantidad de <span className="font-bold text-neutral-dark">{formatCurrency(LOGGED_IN_USER.accumulatedCuotas)}</span> ha sido cargada correctamente al sistema.
              </p>
            </div>
            
            <div className="bg-neutral-bg p-5 rounded-2xl border border-gray-200 text-left space-y-2 max-w-md mx-auto">
              <span className="block text-xs font-bold text-neutral-muted uppercase">Estatus de Solicitud</span>
              <span className="block text-base font-bold text-primary-deep">En Validación Técnica (Periodo de Aportaciones)</span>
              <span className="block text-xs text-neutral-muted">Le notificaremos de forma automática a través de su correo electrónico y su canal de WhatsApp cuando este estatus cambie.</span>
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
