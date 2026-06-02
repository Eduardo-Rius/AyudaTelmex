import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, ShieldCheck, Calendar, FileText, LayoutDashboard, FolderOpen } from 'lucide-react';
import { LOGGED_IN_USER } from '../../data/mockData';

export default function PrivateHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-primary-deep text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <Link to="/asociado/dashboard" className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-accent-tech rounded-lg p-1">
            <div className="bg-white text-primary-deep p-2 rounded-xl">
              <ShieldCheck className="h-7 w-7 text-primary-brand" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-xl font-extrabold leading-none tracking-tight">AYUDA MUTUA</span>
              <span className="block text-xs font-semibold text-accent-tech tracking-widest uppercase">ZONA DE ASOCIADOS</span>
            </div>
          </Link>

          {/* User Info Capsule */}
          <div className="hidden lg:flex items-center gap-3 bg-primary-brand/30 border border-primary-brand/50 rounded-2xl py-2 px-4">
            <div className="bg-accent-tech text-primary-deep p-2 rounded-full font-bold w-10 h-10 flex items-center justify-center">
              ER
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-white">{LOGGED_IN_USER.name}</span>
              <span className="block text-xs text-blue-200">Asociado No. {LOGGED_IN_USER.id} | {LOGGED_IN_USER.status}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 hover:bg-red-600 border border-transparent hover:border-red-400 text-white font-semibold text-lg px-4 py-2.5 rounded-xl transition-all duration-200 focus-visible:outline-none"
              aria-label="Cerrar sesión del portal"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subnavigation Bar for Associate Pages */}
      <div className="bg-primary-brand border-t border-primary-deep/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 py-2 overflow-x-auto scrollbar-none whitespace-nowrap flex-nowrap" aria-label="Menú de sección">
            <Link
              to="/asociado/dashboard"
              className={`inline-flex items-center gap-2 text-white font-semibold text-lg px-4 py-3 rounded-xl transition-all shrink-0 ${
                isActive('/asociado/dashboard')
                  ? 'bg-primary-deep shadow-inner'
                  : 'hover:bg-primary-deep/50'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 text-accent-tech" />
              <span>Mi Resumen</span>
            </Link>

            <Link
              to="/asociado/estado-cuenta"
              className={`inline-flex items-center gap-2 text-white font-semibold text-lg px-4 py-3 rounded-xl transition-all shrink-0 ${
                isActive('/asociado/estado-cuenta')
                  ? 'bg-primary-deep shadow-inner'
                  : 'hover:bg-primary-deep/50'
              }`}
            >
              <FileText className="h-5 w-5 text-accent-tech" />
              <span>Estado de Cuenta</span>
            </Link>

            <Link
              to="/asociado/documentos"
              className={`inline-flex items-center gap-2 text-white font-semibold text-lg px-4 py-3 rounded-xl transition-all shrink-0 ${
                isActive('/asociado/documentos')
                  ? 'bg-primary-deep shadow-inner'
                  : 'hover:bg-primary-deep/50'
              }`}
            >
              <FolderOpen className="h-5 w-5 text-accent-tech" />
              <span>Documentos</span>
            </Link>

            <Link
              to="/asociado/perfil"
              className={`inline-flex items-center gap-2 text-white font-semibold text-lg px-4 py-3 rounded-xl transition-all shrink-0 ${
                isActive('/asociado/perfil')
                  ? 'bg-primary-deep shadow-inner'
                  : 'hover:bg-primary-deep/50'
              }`}
            >
              <User className="h-5 w-5 text-accent-tech" />
              <span>Mi Perfil</span>
            </Link>

            <Link
              to="/asociado/recuperacion-cuotas"
              className={`inline-flex items-center gap-2 text-white font-semibold text-lg px-4 py-3 rounded-xl transition-all shrink-0 ${
                isActive('/asociado/recuperacion-cuotas')
                  ? 'bg-primary-deep shadow-inner'
                  : 'hover:bg-primary-deep/50'
              }`}
            >
              <ShieldCheck className="h-5 w-5 text-accent-tech" />
              <span>Recuperación de Cuotas</span>
            </Link>

            <Link
              to="/asociado/eventos"
              className={`inline-flex items-center gap-2 text-white font-semibold text-lg px-4 py-3 rounded-xl transition-all shrink-0 ${
                isActive('/asociado/eventos')
                  ? 'bg-primary-deep shadow-inner'
                  : 'hover:bg-primary-deep/50'
              }`}
            >
              <Calendar className="h-5 w-5 text-accent-tech" />
              <span>Eventos</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
