import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldCheck } from 'lucide-react';

export default function PublicHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-accent-tech rounded-lg p-1 cursor-pointer"
          >
            <div className="bg-primary-deep text-white p-2 rounded-xl transition-all duration-300 group-hover:scale-105">
              <ShieldCheck className="h-7 w-7 text-accent-tech" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-xl font-extrabold text-primary-deep leading-none tracking-tight">
                AYUDA MUTUA
              </span>
              <span className="block text-xs font-semibold text-primary-brand tracking-widest uppercase">
                TELMEX, A.C.
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8" aria-label="Menú principal de navegación">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-deep font-semibold text-lg py-2 focus-visible:outline-none cursor-pointer"
            >
              Inicio
            </Link>
            <a
              href="#beneficios"
              className="text-gray-700 hover:text-primary-deep font-semibold text-lg py-2 focus-visible:outline-none cursor-pointer"
            >
              Beneficios
            </a>
            <a
              href="#tramites"
              className="text-gray-700 hover:text-primary-deep font-semibold text-lg py-2 focus-visible:outline-none cursor-pointer"
            >
              Trámites Frecuentes
            </a>
            <a
              href="#contacto"
              className="text-gray-700 hover:text-primary-deep font-semibold text-lg py-2 focus-visible:outline-none cursor-pointer"
            >
              Soporte
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="text-primary-brand hover:text-primary-deep font-semibold text-base px-3 py-2 border border-transparent rounded-lg hover:border-gray-200 focus-visible:outline-none transition-colors cursor-pointer"
            >
              Administrador
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-primary-brand hover:bg-primary-deep text-white font-bold text-lg px-6 py-3 rounded-xl shadow-md transition-all-smooth hover:shadow-lg focus-visible:outline-none cursor-pointer"
            >
              <User className="h-5 w-5" />
              <span>Zona de Asociados</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
