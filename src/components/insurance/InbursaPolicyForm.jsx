import React from 'react';
import inbursaLogo from '../../../Inbursa Logo.png';
import ayudaLogo from '../../../Ayuda Telmex Logo.jpeg';

export default function InbursaPolicyForm({
  associate = {},
  policy = {},
  beneficiaries = [],
  substituteBeneficiaries = []
}) {
  const a = associate || {};
  const pi = a.policyInfo || {};
  const addr = a.address || {};
  const cov = policy?.coverages || {
    death: 'Ampara',
    accidentalDeath: 'Ampara',
    disability: 'Ampara'
  };

  const TableHeader = ({ children }) => (
    <th className="border border-gray-400 bg-gray-200 px-2 py-1 text-[10px] font-bold text-gray-700 text-center uppercase">
      {children}
    </th>
  );

  const TableCell = ({ children, align = 'center' }) => (
    <td className={`border border-gray-400 px-2 py-1 text-[11px] text-gray-800 text-${align} min-h-[24px]`}>
      {children || '\u00A0'}
    </td>
  );

  const SectionTitle = ({ title }) => (
    <div className="font-bold text-[11px] mt-4 mb-1 text-gray-800 uppercase tracking-wide">{title}</div>
  );

  // A4 dimensions: 794px width, approx 1123px height
  return (
    <div 
      id="pdf-content" 
      className="bg-white p-10 border border-gray-300 shadow-sm mx-auto text-left font-sans flex flex-col relative"
      style={{ width: '794px', minHeight: '1123px' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <img src={inbursaLogo} alt="Inbursa" className="h-16 object-contain" />
        <div className="text-center mt-2 flex-1 px-4">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-widest">
            Certificado de Seguro de Grupo Vida
          </h1>
          <p className="text-[10px] text-gray-600 mt-3 max-w-md mx-auto leading-relaxed">
            Seguros Inbursa, S.A., Grupo Financiero Inbursa, certifica que el Asegurado cuyos datos se especifican más adelante, está protegido por la Póliza de Seguro de Grupo Vida, sujeta a las Condiciones Generales, Particulares y Endosos de dicha Póliza.
          </p>
        </div>
        <div className="w-16"></div>
      </div>

      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col items-center ml-4">
          <img src={ayudaLogo} alt="Ayuda Mutua" className="h-14 object-contain mb-2" />
          <span className="font-bold text-[11px] text-gray-800 uppercase tracking-wider">
            AYUDA MUTUA EN TELMEX, A.C.
          </span>
        </div>
        <div className="border border-gray-400 w-40 mr-4 shadow-sm">
          <div className="bg-gray-200 text-[10px] font-bold py-1.5 text-center border-b border-gray-400 uppercase">
            No. de Certificado
          </div>
          <div className="py-2 text-center text-[13px] font-bold h-10 flex items-center justify-center">
            {policy?.policyNumber || ''}
          </div>
        </div>
      </div>

      {/* Datos del Asegurado */}
      <SectionTitle title="Datos del Asegurado" />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <TableHeader>Apellido paterno</TableHeader>
            <TableHeader>Apellido materno</TableHeader>
            <TableHeader>Nombre(s)</TableHeader>
            <TableHeader>Fecha de nacimiento</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>{a.paternalSurname}</TableCell>
            <TableCell>{a.maternalSurname}</TableCell>
            <TableCell>{a.firstName}</TableCell>
            <TableCell>{a.birthDate}</TableCell>
          </tr>
        </tbody>
      </table>

      {/* Domicilio Particular del Asegurado */}
      <SectionTitle title="Domicilio Particular del Asegurado" />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <TableHeader>Calle</TableHeader>
            <TableHeader>Colonia</TableHeader>
            <TableHeader>Población</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Código Postal</TableHeader>
            <TableHeader>Teléfono</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>{addr.street}</TableCell>
            <TableCell>{addr.colony}</TableCell>
            <TableCell>{addr.city}</TableCell>
            <TableCell>{addr.state}</TableCell>
            <TableCell>{addr.postalCode}</TableCell>
            <TableCell>{addr.phone}</TableCell>
          </tr>
        </tbody>
      </table>

      {/* Datos de la Póliza */}
      <SectionTitle title="Datos de la Póliza" />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <TableHeader>No. de Póliza</TableHeader>
            <TableHeader>Expediente</TableHeader>
            <TableHeader>Ciudad</TableHeader>
            <TableHeader>Fecha de ingreso a la Asociación</TableHeader>
            <TableHeader>Tipo de Asociado</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>{policy?.policyNumber}</TableCell>
            <TableCell>{pi.expediente}</TableCell>
            <TableCell>{pi.city}</TableCell>
            <TableCell>{pi.joinDate}</TableCell>
            <TableCell>{pi.associateType}</TableCell>
          </tr>
        </tbody>
      </table>

      {/* Suma Asegurada */}
      <SectionTitle title="Suma Asegurada Cubierta Por:" />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <TableHeader>Muerte por cualquier causa</TableHeader>
            <TableHeader>Muerte por Accidente</TableHeader>
            <TableHeader>Beneficio por Invalidez Total y Permanente</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>{cov.death}</TableCell>
            <TableCell>{cov.accidentalDeath}</TableCell>
            <TableCell>{cov.disability}</TableCell>
          </tr>
        </tbody>
      </table>

      {/* Beneficiarios */}
      <SectionTitle title="Beneficiarios" />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <TableHeader>%</TableHeader>
            <TableHeader>Apellido paterno</TableHeader>
            <TableHeader>Apellido materno</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Parentesco</TableHeader>
            <TableHeader>Edad</TableHeader>
          </tr>
        </thead>
        <tbody>
          {beneficiaries && beneficiaries.length > 0 ? (
            beneficiaries.map((b, i) => (
              <tr key={i}>
                <TableCell>{b.percentage ? `${b.percentage}%` : ''}</TableCell>
                <TableCell>{b.paternalSurname}</TableCell>
                <TableCell>{b.maternalSurname}</TableCell>
                <TableCell>{b.firstName || b.name}</TableCell>
                <TableCell>{b.relationship}</TableCell>
                <TableCell>{b.age}</TableCell>
              </tr>
            ))
          ) : (
            <tr>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </tr>
          )}
        </tbody>
      </table>

      {/* O en su defecto */}
      <SectionTitle title="O En Su Defecto" />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <TableHeader>%</TableHeader>
            <TableHeader>Apellido paterno</TableHeader>
            <TableHeader>Apellido materno</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Parentesco</TableHeader>
            <TableHeader>Edad</TableHeader>
          </tr>
        </thead>
        <tbody>
          {substituteBeneficiaries && substituteBeneficiaries.length > 0 ? (
            substituteBeneficiaries.map((b, i) => (
              <tr key={i}>
                <TableCell>{b.percentage ? `${b.percentage}%` : ''}</TableCell>
                <TableCell>{b.paternalSurname}</TableCell>
                <TableCell>{b.maternalSurname}</TableCell>
                <TableCell>{b.firstName || b.name}</TableCell>
                <TableCell>{b.relationship}</TableCell>
                <TableCell>{b.age}</TableCell>
              </tr>
            ))
          ) : (
            <tr>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex-grow"></div>

      {/* Legal Text */}
      <div className="mt-8 mb-12 text-[10px] leading-relaxed text-gray-700 text-justify">
        La suma de los porcentajes de los beneficiarios deberá ser igual al 100%. El Asegurado tiene el derecho de cambiar a sus beneficiarios en cualquier momento, siempre y cuando lo notifique por escrito a la Aseguradora. En caso de que no existan beneficiarios designados, o que hayan fallecido antes que el Asegurado, la suma asegurada se pagará a la sucesión del Asegurado. Este documento es un resumen de las coberturas y no modifica ni sustituye las Condiciones Generales de la Póliza.
      </div>

      {/* Signatures */}
      <div className="mb-4 flex justify-between items-end text-[11px] text-gray-800 px-4">
        <div className="flex flex-col items-center">
          <div className="w-48 border-b border-gray-600 mb-1">
            <div className="text-center pb-1 h-5">{new Date().toLocaleDateString()}</div>
          </div>
          <span className="font-semibold">Fechado el</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-56 border-b border-gray-600 mb-1 h-5"></div>
          <span className="font-semibold">Firma del asegurado</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-56 border-b border-gray-600 mb-1 h-5"></div>
          <span className="font-semibold">Firma / Sello Inbursa</span>
        </div>
      </div>
    </div>
  );
}
