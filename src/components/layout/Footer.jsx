import React from 'react';
import { Phone, Mail, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-deep text-white border-t-4 border-accent-tech w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna 1: Marca y Descripción */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-accent-tech" aria-hidden="true" />
              <div>
                <span className="block text-lg font-bold">Ayuda Mutua TELMEX, A.C.</span>
                <span className="block text-xs text-blue-200 uppercase tracking-widest">Asociación de Fideicomiso</span>
              </div>
            </div>
            <p className="text-blue-100 text-base leading-relaxed">
              Protección y previsión social para los trabajadores y asociados del Grupo TELMEX. Más de 7,400 asociados protegidos.
            </p>
          </div>

          {/* Columna 2: Soporte Telefónico Directo */}
          <div className="space-y-4 bg-primary-brand/20 p-5 rounded-2xl border border-primary-brand/40">
            <h3 className="text-lg font-bold flex items-center gap-2 text-accent-tech">
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span>Soporte Telefónico Directo</span>
            </h3>
            <div className="space-y-2">
              <p className="text-base text-white">
                Si requieres asistencia para realizar algún trámite o recuperar tu contraseña, comunícate con nosotros:
              </p>
              <div className="block font-black text-2xl text-white tracking-wider my-2 focus-visible:outline-none">
                800-123-MUTUA (68882)
              </div>
              <p className="text-xs text-blue-200">
                Horario de atención: Lunes a Viernes de 9:00 AM a 6:00 PM.
              </p>
            </div>
          </div>

          {/* Columna 3: Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-accent-tech">
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
              <span>Información de Contacto</span>
            </h3>
            <ul className="space-y-3 text-base text-blue-100">
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent-tech" aria-hidden="true" />
                <a href="mailto:soporte@ayudamutua.org.mx" className="hover:underline focus-visible:outline-none">
                  soporte@ayudamutua.org.mx
                </a>
              </li>
              <li>
                Oficina Central: Parque Vía 190, Col. Cuauhtémoc, Alcaldía Cuauhtémoc, Ciudad de México, C.P. 06500.
              </li>
            </ul>
          </div>

        </div>

        {/* Bloque Único de Copyright */}
        <div className="border-t border-primary-brand/35 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-blue-200">
          <p>© 2026 Ayuda Mutua en TELMEX, A.C. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#aviso" className="hover:underline hover:text-white">Aviso de Privacidad</a>
            <a href="#terminos" className="hover:underline hover:text-white">Términos de Servicio</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
