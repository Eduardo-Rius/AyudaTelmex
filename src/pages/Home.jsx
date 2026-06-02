import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Calendar, Award, PiggyBank, ArrowRight, Bell, FileText, CheckCircle2, XCircle, ArrowUpRight, Building2, Zap, Check } from 'lucide-react';
import PublicHeader from '../components/layout/PublicHeader';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { GENERAL_STATS } from '../data/mockData';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Public Header Navigation */}
      <PublicHeader />

      <main className="flex-1">
        
        {/* 1. HERO SECTION WITH INSTITUTIONAL SVG ILLUSTRATION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#003B5C]/10 to-[#F4F7FA] py-16 sm:py-24 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Text & Call to Actions */}
              <div className="lg:col-span-7 text-left space-y-6">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-primary-brand/10 text-primary-deep">
                  <ShieldCheck className="h-4 w-4" /> Prototipo Rius AI — Propuesta de Modernización
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-deep leading-tight tracking-tight">
                  Ayuda Mutua TELMEX, ahora más simple, cercana y digital
                </h1>
                <p className="text-xl sm:text-2xl text-neutral-muted font-normal leading-relaxed">
                  Una plataforma moderna para consultar beneficios, realizar trámites, actualizar información y participar en eventos desde un solo lugar.
                </p>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="primary" className="w-full py-4 text-lg">
                      Ingresar a Zona de Asociados
                    </Button>
                  </Link>
                  <a href="#beneficios" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full py-4 text-lg">
                      Conocer Beneficios
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right Column: High-Fidelity CSS/SVG Illustration with Floating Cards */}
              <div className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center">
                
                {/* SVG Illustration Container */}
                <div className="relative z-10 w-full max-w-[420px] aspect-square flex items-center justify-center">
                  <svg viewBox="0 0 500 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="shieldGrad" x1="12" y1="12" x2="48" y2="46" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#00A878" />
                        <stop offset="100%" stopColor="#007B55" />
                      </linearGradient>
                      <filter id="illustrationShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.08" />
                      </filter>
                    </defs>

                    {/* Background decorative circles */}
                    <circle cx="250" cy="200" r="160" stroke="#005B96" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.15" />
                    <circle cx="250" cy="200" r="110" stroke="#00A6D6" strokeWidth="1" opacity="0.1" />

                    {/* The Portal / Tablet Mockup */}
                    <g filter="url(#illustrationShadow)">
                      {/* Device Frame */}
                      <rect x="80" y="60" width="340" height="240" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
                      {/* Device Top Bar */}
                      <path d="M80 76 C80 67.1634, 87.1634 60, 96 60 H404 C412.837 60, 420 67.1634, 420 76 V90 H80 V76 Z" fill="#003B5C" />
                      {/* Browser Dots */}
                      <circle cx="102" cy="75" r="4.5" fill="#FF5F56" />
                      <circle cx="116" cy="75" r="4.5" fill="#FFBD2E" />
                      <circle cx="130" cy="75" r="4.5" fill="#27C93F" />
                      {/* Browser Title */}
                      <rect x="150" y="70" width="200" height="10" rx="5" fill="#FFFFFF" fillOpacity="0.15" />
                      
                      {/* Grid elements representing platform data */}
                      <rect x="100" y="110" width="80" height="35" rx="6" fill="#F1F5F9" />
                      <rect x="108" y="118" width="50" height="6" rx="3" fill="#E2E8F0" />
                      <rect x="108" y="128" width="64" height="6" rx="3" fill="#00A6D6" opacity="0.3" />

                      <rect x="190" y="110" width="80" height="35" rx="6" fill="#F1F5F9" />
                      <rect x="198" y="118" width="50" height="6" rx="3" fill="#E2E8F0" />
                      <rect x="198" y="128" width="64" height="6" rx="3" fill="#00A878" opacity="0.3" />

                      <rect x="280" y="110" width="120" height="35" rx="6" fill="#F1F5F9" />
                      <rect x="288" y="118" width="80" height="6" rx="3" fill="#E2E8F0" />
                      <rect x="288" y="128" width="100" height="6" rx="3" fill="#003B5C" opacity="0.2" />

                      {/* Graphic chart line indicating simple progression */}
                      <path d="M100 240 L150 210 L200 225 L250 185 L300 200 L350 160 L400 175" fill="none" stroke="#005B96" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="350" cy="160" r="4.5" fill="#005B96" />
                      <circle cx="250" cy="185" r="4.5" fill="#005B96" />
                    </g>

                    {/* Elderly Associate Silhouette using portal (at bottom-left corner) */}
                    <g transform="translate(60, 190)" filter="url(#illustrationShadow)">
                      {/* Body/Shoulders */}
                      <path d="M5 90 C5 60, 25 50, 50 50 C75 50, 95 60, 95 90 Z" fill="#003B5C" />
                      {/* Head */}
                      <circle cx="50" cy="25" r="22" fill="#FFE5D9" />
                      {/* Silver/Gray Hair */}
                      <path d="M28 25 C28 10, 72 10, 72 25 C72 15, 65 8, 50 8 C35 8, 28 15, 28 25 Z" fill="#E2E8F0" />
                      <circle cx="50" cy="8" r="8" fill="#E2E8F0" />
                      {/* Glasses */}
                      <circle cx="41" cy="23" r="5.5" stroke="#475569" strokeWidth="1.5" fill="none" />
                      <circle cx="59" cy="23" r="5.5" stroke="#475569" strokeWidth="1.5" fill="none" />
                      <line x1="46.5" y1="23" x2="53.5" y2="23" stroke="#475569" strokeWidth="1.5" />
                      {/* Happy smile */}
                      <path d="M45 32 Q50 36 55 32" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </g>

                    {/* Protection / Family Silhouette Representation (Top Right) */}
                    <g transform="translate(295, 25)" filter="url(#illustrationShadow)">
                      {/* Background circle */}
                      <circle cx="45" cy="45" r="35" fill="#FFFFFF" stroke="#005B96" strokeWidth="2" />
                      {/* House outline (roof/protection) */}
                      <path d="M25 40 L45 23 L65 40" stroke="#005B96" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      {/* House walls */}
                      <path d="M30 38 V57 H60 V38" stroke="#005B96" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      {/* Stylized family shapes */}
                      <circle cx="39" cy="45" r="3.5" fill="#00A6D6" />
                      <path d="M34 57 C34 50, 44 50, 44 57 Z" fill="#00A6D6" />
                      <circle cx="51" cy="46" r="3" fill="#00A878" />
                      <path d="M47 57 C47 51, 55 51, 55 57 Z" fill="#00A878" />
                    </g>

                    {/* Security Shield Representation (Bottom Right) */}
                    <g transform="translate(370, 205)" filter="url(#illustrationShadow)">
                      {/* Glowing circle */}
                      <circle cx="30" cy="30" r="26" fill="#00A878" fillOpacity="0.12" />
                      {/* Shield path */}
                      <path d="M30 12 C38 12, 48 15, 48 27 C48 39, 30 46, 30 46 C30 46, 12 39, 12 27 C12 15, 22 12, 30 12 Z" fill="url(#shieldGrad)" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
                      {/* Checkmark inside shield */}
                      <path d="M22 28 L27 33 L38 21" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </g>

                    {/* Simple Procedures Badge (Left Center) */}
                    <g transform="translate(45, 105)" filter="url(#illustrationShadow)">
                      <circle cx="20" cy="20" r="18" fill="#00A6D6" />
                      {/* Document icon */}
                      <rect x="12" y="11" width="16" height="18" rx="2" fill="#FFFFFF" />
                      <line x1="15" y1="15" x2="25" y2="15" stroke="#00A6D6" strokeWidth="1.5" />
                      <line x1="15" y1="19" x2="25" y2="19" stroke="#00A6D6" strokeWidth="1.5" />
                      <line x1="15" y1="23" x2="21" y2="23" stroke="#00A6D6" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>

                {/* Card 1: Póliza vigente */}
                <div className="absolute top-4 left-4 bg-white border border-success-trust/30 rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20 animate-bounce [animation-duration:5.5s]">
                  <div className="bg-success-trust/10 text-success-trust p-1.5 rounded-lg shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="block font-bold text-primary-deep leading-none">Póliza vigente</span>
                    <span className="text-xxs text-neutral-muted">Seguro de Vida</span>
                  </div>
                </div>

                {/* Card 2: Cuotas disponibles */}
                <div className="absolute bottom-6 right-2 bg-white border border-primary-brand/35 rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20 animate-bounce [animation-duration:6s]">
                  <div className="bg-primary-deep/5 text-primary-deep p-1.5 rounded-lg shrink-0">
                    <PiggyBank className="h-5 w-5 text-primary-brand" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="block font-bold text-primary-deep leading-none">Cuotas disponibles</span>
                    <span className="text-xxs text-neutral-muted">$85,420.00 MXN</span>
                  </div>
                </div>

                {/* Card 3: Trámite recibido */}
                <div className="absolute top-24 -right-4 bg-white border border-accent-tech/35 rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20 animate-bounce [animation-duration:4.5s]">
                  <div className="bg-accent-tech/15 text-primary-brand p-1.5 rounded-lg shrink-0">
                    <FileText className="h-5 w-5 text-accent-tech" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="block font-bold text-primary-deep leading-none">Trámite recibido</span>
                    <span className="text-xxs text-neutral-muted">Folio T-8921</span>
                  </div>
                </div>

                {/* Card 4: Notificación enviada */}
                <div className="absolute -bottom-8 left-16 bg-white border border-warning-alert/30 rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20 animate-bounce [animation-duration:7s]">
                  <div className="bg-warning-alert/15 text-warning-alert p-1.5 rounded-lg shrink-0">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="block font-bold text-primary-deep leading-none">Notificación enviada</span>
                    <span className="text-xxs text-neutral-muted">WhatsApp / SMS</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* TRUST STATS */}
        <section className="bg-white border-b border-gray-200 py-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <span className="block text-4xl sm:text-5xl font-black text-primary-deep">
                  {GENERAL_STATS.totalAssociates.toLocaleString()}
                </span>
                <span className="block text-sm sm:text-base font-bold text-neutral-muted uppercase tracking-wider">
                  Asociados Activos
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-4xl sm:text-5xl font-black text-primary-deep">
                  {GENERAL_STATS.averageAge} años
                </span>
                <span className="block text-sm sm:text-base font-bold text-neutral-muted uppercase tracking-wider">
                  Edad Promedio
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-4xl sm:text-5xl font-black text-primary-deep">
                  {GENERAL_STATS.companiesCount}
                </span>
                <span className="block text-sm sm:text-base font-bold text-neutral-muted uppercase tracking-wider">
                  Empresas del Grupo
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-4xl sm:text-5xl font-black text-primary-deep">
                  {GENERAL_STATS.pillarsCount}
                </span>
                <span className="block text-sm sm:text-base font-bold text-neutral-muted uppercase tracking-wider">
                  Pilares de Apoyo
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ANTES VS AHORA (COMPARACIÓN STORYTELLING) */}
        <section className="py-16 sm:py-24 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-deep">
                Modernización con ahorro operativo real
              </h2>
              <p className="text-lg text-neutral-muted">
                Una comparación clara del modelo operativo actual frente a la eficiencia de la nueva plataforma Rius AI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Plataforma actual */}
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-neutral-dark flex items-center gap-2.5">
                    <XCircle className="h-7 w-7 text-red-500 shrink-0" />
                    <span>Plataforma actual</span>
                  </h3>
                  <p className="text-base text-neutral-muted">
                    El esquema operativo tradicional presenta limitaciones en la agilidad y elevados costos fijos de soporte:
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Dependencia del proveedor para cualquier cambio normativo o de lógica.',
                      'Cambios lentos y burocráticos debido a licenciamientos cerrados.',
                      'Alto costo anual por mantenimiento de servidores locales y contratos.',
                      'Poca automatización, dependiendo de planillas manuales de Excel.',
                      'Portal poco intuitivo y difícil de navegar para jubilados y adultos mayores.'
                    ].map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base text-neutral-muted">
                        <span className="text-red-500 font-bold mt-1 text-sm shrink-0">✕</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Nueva Plataforma Rius AI */}
              <div className="bg-white rounded-3xl border-2 border-success-trust/40 p-8 shadow-md flex flex-col justify-between space-y-6 ring-4 ring-success-trust/5">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-primary-deep flex items-center gap-2.5">
                    <CheckCircle2 className="h-7 w-7 text-success-trust shrink-0" />
                    <span>Nueva plataforma Rius AI</span>
                  </h3>
                  <p className="text-base text-neutral-muted">
                    Nuestra solución introduce un modelo flexible, con interfaces diseñadas para la inclusión de adultos mayores:
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Menor costo anual y control total del código por el Fideicomiso.',
                      'Cambios rápidos y arquitectura modular adaptable a nuevas reglas.',
                      'UX accesible para asociados 64+ con botones amplios e interfaces limpias.',
                      'Automatización de aportaciones de nómina con validaciones integradas.',
                      'Notificaciones proactivas mediante WhatsApp y correo electrónico.'
                    ].map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base text-neutral-dark">
                        <span className="text-success-trust font-bold mt-1 text-sm shrink-0">✓</span>
                        <span className="font-semibold text-primary-deep">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. AHORRO ESTIMADO */}
        <section className="py-16 sm:py-24 bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-primary-deep">Ahorro estimado</h2>
              <p className="text-lg text-neutral-muted max-w-3xl mx-auto">
                Eficiencia operativa y optimización contable que reduce significativamente los egresos recurrentes de TI.
              </p>
            </div>

            <div className="bg-neutral-bg border border-gray-200 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center shadow-inner">
              <div className="space-y-2 md:border-r border-gray-300 md:pr-6">
                <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Costo actual estimado</span>
                <span className="block text-3xl font-black text-red-600">$17,000 USD <span className="text-sm font-semibold text-neutral-muted">/ año</span></span>
                <span className="block text-xs text-neutral-muted">Basado en infraestructura tradicional</span>
              </div>

              <div className="space-y-2 md:border-r border-gray-300 md:px-6">
                <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Nuevo mantenimiento estimado</span>
                <span className="block text-3xl font-black text-success-trust">Menor y flexible</span>
                <span className="block text-xs text-neutral-muted">Modelo modular serverless</span>
              </div>

              <div className="space-y-2 md:pl-6">
                <span className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Ahorro esperado</span>
                <span className="block text-5xl font-black text-primary-deep">35% a 55%</span>
                <span className="block text-xs text-primary-brand font-bold">Retorno de inversión directo</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex items-start gap-4 text-left max-w-3xl mx-auto shadow-sm">
              <Zap className="h-6 w-6 text-primary-brand shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-primary-deep">Infraestructura optimizada: sin servidor enterprise dedicado</h4>
                <p className="text-sm text-neutral-muted leading-relaxed">
                  El nuevo modelo prescinde de hardware enterprise dedicado que genera cobros fijos de mantenimiento. La arquitectura estática con lógica en la nube procesa la información de forma segura y escala bajo demanda, eliminando cobros redundantes del proveedor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REFORZAR LOS 4 PILARES */}
        <section id="beneficios" className="scroll-mt-24 py-16 sm:py-24 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-deep">Nuestros 4 Pilares de Beneficio</h2>
              <p className="text-lg text-neutral-muted">
                Programas del Fideicomiso estructurados para garantizar el bienestar de los asociados y sus familias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Pilar 1: Protección */}
              <Card className="flex flex-col justify-between text-left h-full border-2 border-gray-150 hover:border-primary-brand/30 transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="bg-primary-deep text-white p-4 rounded-2xl shrink-0 shadow-md">
                    <ShieldCheck className="h-8 w-8 text-accent-tech" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-primary-deep">Protección</h3>
                    <p className="text-base text-neutral-muted leading-relaxed">
                      Respaldo económico a través de nuestro Seguro de Vida Mutualista. Un esquema de auxilio oportuno diseñado para dar tranquilidad y protección financiera inmediata a tus beneficiarios en momentos difíciles.
                    </p>
                    <div className="inline-block bg-primary-brand/10 text-primary-deep text-xs font-bold px-3 py-1.5 rounded-lg border border-primary-brand/20">
                      Dato operativo real: 7,000+ coberturas vigentes
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 mt-6 flex justify-end">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-primary-brand hover:text-primary-deep font-bold text-base group">
                    <span>Ver detalle</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Card>

              {/* Pilar 2: Ahorro */}
              <Card className="flex flex-col justify-between text-left h-full border-2 border-gray-150 hover:border-primary-brand/30 transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="bg-primary-deep text-white p-4 rounded-2xl shrink-0 shadow-md">
                    <PiggyBank className="h-8 w-8 text-accent-tech" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-primary-deep">Ahorro</h3>
                    <p className="text-base text-neutral-muted leading-relaxed">
                      Recuperación de tus cuotas aportadas voluntariamente. Al alcanzar la jubilación, puedes retirar el saldo acumulado en tu cuenta individual mediante un trámite ágil de autogestión de solo 3 pasos.
                    </p>
                    <div className="inline-block bg-primary-brand/10 text-primary-deep text-xs font-bold px-3 py-1.5 rounded-lg border border-primary-brand/20">
                      Dato operativo real: promedio de 600 solicitudes al año
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 mt-6 flex justify-end">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-primary-brand hover:text-primary-deep font-bold text-base group">
                    <span>Ver detalle</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Card>

              {/* Pilar 3: Académicos */}
              <Card className="flex flex-col justify-between text-left h-full border-2 border-gray-150 hover:border-primary-brand/30 transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="bg-primary-deep text-white p-4 rounded-2xl shrink-0 shadow-md">
                    <Award className="h-8 w-8 text-accent-tech" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-primary-deep">Académicos</h3>
                    <p className="text-base text-neutral-muted leading-relaxed">
                      Reconocimiento al desempeño escolar de los hijos y nietos de nuestros asociados. Premios económicos directos para incentivar la excelencia escolar y apoyar la formación académica de las nuevas generaciones.
                    </p>
                    <div className="inline-block bg-primary-brand/10 text-primary-deep text-xs font-bold px-3 py-1.5 rounded-lg border border-primary-brand/20">
                      Dato operativo real: 2 convocatorias de premios anuales
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 mt-6 flex justify-end">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-primary-brand hover:text-primary-deep font-bold text-base group">
                    <span>Ver detalle</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Card>

              {/* Pilar 4: Social y Deportivo */}
              <Card className="flex flex-col justify-between text-left h-full border-2 border-gray-150 hover:border-primary-brand/30 transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="bg-primary-deep text-white p-4 rounded-2xl shrink-0 shadow-md">
                    <Calendar className="h-8 w-8 text-accent-tech" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-primary-deep">Social y Deportivo</h3>
                    <p className="text-base text-neutral-muted leading-relaxed">
                      Fomento a la convivencia comunitaria, recreación y salud física de nuestros asociados jubilados mediante torneos anuales de ajedrez, dominó, boliche, atletismo y eventos de fin de año.
                    </p>
                    <div className="inline-block bg-primary-brand/10 text-primary-deep text-xs font-bold px-3 py-1.5 rounded-lg border border-primary-brand/20">
                      Dato operativo real: 5 encuentros nacionales al año
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 mt-6 flex justify-end">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-primary-brand hover:text-primary-deep font-bold text-base group">
                    <span>Ver detalle</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Card>

            </div>
          </div>
        </section>

        {/* 5. MEJORAR SECCIÓN TRÁMITES FRECUENTES */}
        <section id="tramites" className="scroll-mt-24 bg-white border-b border-gray-200 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-deep">Trámites frecuentes</h2>
              <p className="text-lg text-neutral-muted">
                Herramientas de autoservicio directo. Diseñadas especialmente para garantizar la facilidad de uso de adultos mayores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Actualizar beneficiarios', desc: 'Edite y valide los porcentajes de su póliza de seguro de vida.' },
                { title: 'Recuperación de cuotas', desc: 'Inicie el reembolso de sus cuotas acumuladas por retiro.' },
                { title: 'Premio al desempeño académico', desc: 'Inscriba a sus hijos o nietos con boletas escolares.' },
                { title: 'Registro a eventos', desc: 'Inscríbase a los torneos de boliche, dominó o cenas locales.' },
                { title: 'Consulta de trámite', desc: 'Revise el avance de solicitudes y dictámenes en proceso.' },
                { title: 'Actualización de datos', desc: 'Mantenga al día su número de nómina, teléfono y dirección.' }
              ].map((t, idx) => (
                <Link
                  key={idx}
                  to="/login"
                  className="flex items-center justify-between p-6 bg-white hover:bg-primary-deep text-neutral-dark hover:text-white rounded-2xl border-2 border-gray-200 transition-all duration-300 group shadow-sm hover:shadow-md text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-tech cursor-pointer min-h-[130px]"
                >
                  <div className="space-y-1 pr-4">
                    <h3 className="text-xl font-bold text-primary-deep group-hover:text-white leading-tight">
                      {t.title}
                    </h3>
                    <p className="text-sm text-neutral-muted group-hover:text-blue-100">
                      {t.desc}
                    </p>
                  </div>
                  <div className="bg-primary-brand/10 text-primary-brand group-hover:bg-accent-tech group-hover:text-primary-deep p-3.5 rounded-full shrink-0 shadow-sm">
                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 6. AUTOMATIZACIÓN ADMINISTRATIVA */}
        <section className="py-16 sm:py-24 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Side: Illustration / Banner */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#003B5C] to-[#005B96] text-white p-8 sm:p-12 flex flex-col justify-between text-left space-y-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-tech/20 rounded-full filter blur-2xl" />
                <div className="space-y-4">
                  <span className="inline-block bg-accent-tech/20 text-accent-tech text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-accent-tech/30">
                    Automatización administrativa
                  </span>
                  <h3 className="text-3xl font-extrabold leading-tight">
                    El corazón operativo: aportaciones de 15 empresas
                  </h3>
                  <p className="text-base text-blue-100 leading-relaxed">
                    Nuestra solución unifica y procesa las aportaciones voluntarias de los trabajadores, eliminando arqueos manuales ineficientes.
                  </p>
                </div>
                
                <div className="space-y-3.5 border-t border-blue-200/20 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-xl text-accent-tech"><Building2 className="h-5 w-5" /></div>
                    <span className="text-base text-blue-50 font-semibold">15 empresas consolidadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-xl text-accent-tech"><Zap className="h-5 w-5" /></div>
                    <span className="text-base text-blue-50 font-semibold">Conciliación automática e inmediata</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Description and Action */}
              <div className="lg:col-span-7 p-8 sm:p-12 text-left flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <h4 className="text-2xl font-bold text-primary-deep border-b border-gray-150 pb-3">
                    Procesamiento administrativo inteligente
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-primary-brand font-bold text-base">
                        <Check className="h-5 w-5 text-success-trust" />
                        <span>Recepción de archivos</span>
                      </div>
                      <p className="text-sm text-neutral-muted leading-relaxed">
                        Carga directa de formatos de nómina sin intermediación técnica.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-primary-brand font-bold text-base">
                        <Check className="h-5 w-5 text-success-trust" />
                        <span>Normalización automática</span>
                      </div>
                      <p className="text-sm text-neutral-muted leading-relaxed">
                        Detección y corrección de inconsistencias en formatos de texto o columnas.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-primary-brand font-bold text-base">
                        <Check className="h-5 w-5 text-success-trust" />
                        <span>Validación contra padrón</span>
                      </div>
                      <p className="text-sm text-neutral-muted leading-relaxed">
                        Cruce inmediato de la CURP y número de nómina de los asociados activos.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-primary-brand font-bold text-base">
                        <Check className="h-5 w-5 text-success-trust" />
                        <span>Arqueo por empresa</span>
                      </div>
                      <p className="text-sm text-neutral-muted leading-relaxed">
                        Cuadre matemático de montos individuales y totales depositados.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-primary-brand font-bold text-base">
                        <Check className="h-5 w-5 text-success-trust" />
                        <span>Alertas de inconsistencias</span>
                      </div>
                      <p className="text-sm text-neutral-muted leading-relaxed">
                        Notificaciones de diferencias de aportaciones de nómina en tiempo real.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-primary-brand font-bold text-base">
                        <Check className="h-5 w-5 text-success-trust" />
                        <span>Reporte consolidado</span>
                      </div>
                      <p className="text-sm text-neutral-muted leading-relaxed">
                        Generación automática del balance contable listo para el Comité.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-150 flex flex-col sm:flex-row gap-4">
                  <Link to="/admin/aportaciones" className="w-full sm:w-auto">
                    <Button variant="primary" className="w-full gap-2 py-4 px-6 text-lg justify-center">
                      <span>Ver demo administrativa</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. MEJORAR CTA FINAL */}
        <section id="contacto" className="scroll-mt-20 bg-gradient-to-r from-[#003B5C] to-[#005B96] text-white py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              Una plataforma más clara para el asociado y más eficiente para la administración.
            </h2>
            <p className="text-lg sm:text-xl text-blue-150 max-w-2xl mx-auto leading-relaxed">
              Consolide todos sus servicios en un entorno moderno que protege y conecta a la comunidad de asociados.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="success" className="w-full sm:w-auto px-8 py-4 text-lg justify-center shadow-lg">
                  Ingresar a Zona de Asociados
                </Button>
              </Link>
              <Link to="/admin/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto bg-white text-[#003B5C] hover:bg-[#003B5C] hover:text-white border-2 border-white px-8 py-4 text-lg justify-center transition-all duration-300"
                >
                  Ver Dashboard Administrativo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Section id="contacto" is wrapped inside Footer) */}
      <Footer />
    </div>
  );
}
