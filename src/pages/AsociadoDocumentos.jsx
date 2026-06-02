import React, { useState } from 'react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { 
  FolderOpen, 
  FileText, 
  Download, 
  BookOpen, 
  FileCheck, 
  Megaphone, 
  Search 
} from 'lucide-react';
import PrivateHeader from '../components/layout/PrivateHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { LOGGED_IN_USER } from '../data/mockData';

export default function AsociadoDocumentos() {
  const [activeCategory, setActiveCategory] = useState('estados');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'estados', label: 'Estados de Cuenta', icon: FileText },
    { id: 'constancias', label: 'Constancias', icon: FileCheck },
    { id: 'reglamentos', label: 'Reglamentos', icon: BookOpen },
    { id: 'comunicados', label: 'Comunicados', icon: Megaphone }
  ];

  const documents = {
    estados: [
      { id: 'E-01', title: 'Estado de Cuenta - Mayo 2026', desc: 'Resumen financiero del periodo actual consolidado.', date: '31/05/2026', size: '240 KB' },
      { id: 'E-02', title: 'Estado de Cuenta - Abril 2026', desc: 'Resumen financiero del mes anterior cerrado.', date: '30/04/2026', size: '238 KB' },
      { id: 'E-03', title: 'Estado de Cuenta - Primer Trimestre 2026', desc: 'Resumen consolidado Enero - Marzo 2026.', date: '31/03/2026', size: '412 KB' }
    ],
    constancias: [
      { id: 'C-01', title: 'Constancia de Afiliación al Fideicomiso', desc: 'Documento acreditativo de derechos mutualistas vigentes.', date: '15/01/2026', size: '180 KB' },
      { id: 'C-02', title: 'Constancia de Retención de Impuestos 2025', desc: 'Declaración anual de rendimientos del ejercicio anterior.', date: '10/02/2026', size: '210 KB' }
    ],
    reglamentos: [
      { id: 'R-01', title: 'Reglamento General de Ayuda Mutua TELMEX', desc: 'Normativa, deberes y condiciones operativas del fondo.', date: '01/01/2026', size: '1.2 MB' },
      { id: 'R-02', title: 'Estatutos Vigentes del Fideicomiso', desc: 'Acta constitutiva y convenios contractuales del grupo.', date: '01/01/2026', size: '940 KB' }
    ],
    comunicados: [
      { id: 'M-01', title: 'Comunicado: Ajuste en Tasas de Rendimiento Q1', desc: 'Actualización sobre rendimientos y diversificación de activos.', date: '12/04/2026', size: '145 KB' },
      { id: 'M-02', title: 'Comunicado: Convocatoria para Asamblea General 2026', desc: 'Citatorio para asociados delegados a la asamblea del fideicomiso.', date: '05/05/2026', size: '162 KB' }
    ]
  };

  const handleDownloadPDF = (title, categoryName) => {
    toast.info(`Generando documento: ${title}...`);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Header institucional
      doc.setFillColor(0, 59, 92); // Azul Marino
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("Ayuda Mutua TELMEX, A.C.", 14, 18);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text("Fideicomiso de Administración y Jubilación", 14, 25);
      doc.text(`Categoría oficial: ${categoryName}`, 14, 30);

      // Título
      doc.setTextColor(0, 59, 92);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(title.toUpperCase(), 14, 50);

      // Datos del Asociado
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Asociado Beneficiario: ${LOGGED_IN_USER.name}`, 14, 58);
      doc.text(`Número de Asociado: ${LOGGED_IN_USER.id}`, 14, 63);
      doc.text(`Empresa: ${LOGGED_IN_USER.company}`, 14, 68);
      doc.text(`Fecha de Descarga: ${new Date().toLocaleString('es-MX')}`, 14, 73);

      // Línea divisoria
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 76, 196, 76);

      // Contenido simulado oficial del documento
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.setFont('Helvetica', 'bold');
      doc.text("CERTIFICACIÓN DE DOCUMENTO DIGITAL", 14, 86);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      let contentY = 94;
      
      const bodyText = [
        `Por medio de la presente, la administración del Fideicomiso Ayuda Mutua TELMEX, A.C., certifica que el archivo titulado "${title}" es una copia electrónica oficial expedida para el asociado ${LOGGED_IN_USER.name}.`,
        "",
        "El presente documento cuenta con validez plena dentro del marco del reglamento del Fideicomiso Mutualista y ha sido visado electrónicamente bajo el sistema de gobierno corporativo del grupo.",
        "",
        "Para cualquier aclaración o trámite relacionado, favor de comunicarse con el área de Control de Padrón y Beneficiarios, proporcionando el código de verificación digital impreso en el pie de página.",
        "",
        "Atentamente,",
        "Comité de Administración del Fideicomiso",
        "Ayuda Mutua TELMEX, A.C."
      ];

      bodyText.forEach(line => {
        if (line === "") {
          contentY += 4;
        } else {
          // Wrap text
          const splitLines = doc.splitTextToSize(line, 180);
          splitLines.forEach(l => {
            doc.text(l, 14, contentY);
            contentY += 6;
          });
        }
      });

      // Pie de firma y sellos digitales
      doc.setFillColor(250, 250, 250);
      doc.rect(14, 230, 182, 28, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.rect(14, 230, 182, 28, 'D');

      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('Helvetica', 'bold');
      doc.text("SELLO DE AUTENTICIDAD DIGITAL RIUS AI", 18, 235);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Código de Verificación: DOCUMENTO-SECURE-${LOGGED_IN_USER.id}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, 18, 241);
      doc.text(`Firma Electrónica FIEL: SHA-256-HASH-${Math.random().toString(16).substring(2, 14).toUpperCase()}`, 18, 247);
      doc.text("El uso indebido o alteración del presente documento constituye una falta grave bajo el reglamento vigente.", 18, 253);

      doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
      toast.success(`"${title}" descargado con éxito.`);
    } catch (error) {
      console.error(error);
      toast.error("Error al generar y descargar el documento PDF.");
    }
  };

  const getFilteredDocs = () => {
    const list = documents[activeCategory] || [];
    if (!searchQuery.trim()) return list;
    return list.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const activeCategoryLabel = categories.find(c => c.id === activeCategory)?.label || '';

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <PrivateHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
        {/* Page Header */}
        <div className="mb-8">
          <span className="px-3 py-1 bg-primary-brand/5 text-primary-brand text-xs font-black rounded-full uppercase tracking-wider border border-primary-brand/10">
            Biblioteca Digital
          </span>
          <h2 className="text-3xl font-extrabold text-primary-deep tracking-tight mt-2">Repositorio de Documentos</h2>
          <p className="text-base text-neutral-muted mt-1">
            Descargue estados de cuenta históricos, reglamentos generales, constancias y circulares informativas vigentes.
          </p>
        </div>

        {/* Categories Tab navigation & Search Row */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center mb-8 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm">
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-primary-deep text-white shadow-md' 
                      : 'bg-neutral-bg text-neutral-muted hover:text-primary-deep hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative md:max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Buscar documento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-xl text-sm font-semibold focus:border-primary-brand focus:ring-1 focus:ring-primary-brand min-h-[40px]"
            />
          </div>
        </div>

        {/* Document Grid */}
        <Card title={activeCategoryLabel}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {getFilteredDocs().map((doc) => (
              <div 
                key={doc.id} 
                className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-start justify-between gap-4 hover:border-primary-brand/50 hover:bg-white transition-all group"
              >
                <div className="space-y-1.5 text-left">
                  <span className="inline-block bg-primary-brand/10 text-primary-brand font-bold text-[10px] px-2 py-0.5 rounded">
                    {doc.id}
                  </span>
                  <h4 className="font-bold text-neutral-dark text-base group-hover:text-primary-deep transition-colors leading-tight">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-neutral-muted leading-relaxed">
                    {doc.desc}
                  </p>
                  <div className="flex gap-4 text-[10px] text-neutral-muted font-semibold pt-1">
                    <span>Fecha: {doc.date}</span>
                    <span>Tamaño: {doc.size}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadPDF(doc.title, activeCategoryLabel)}
                  className="p-3 bg-white border border-gray-250 text-neutral-muted hover:text-primary-brand hover:border-primary-brand/40 rounded-xl shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
                  aria-label={`Descargar ${doc.title}`}
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            ))}

            {getFilteredDocs().length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-12 text-neutral-muted">
                <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-base font-bold">No se encontraron documentos en esta categoría.</p>
                <p className="text-xs mt-1">Prueba refinando los términos de búsqueda.</p>
              </div>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
