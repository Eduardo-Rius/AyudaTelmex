import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, FileSpreadsheet, ClipboardList, LogOut, ArrowLeft, Briefcase } from 'lucide-react';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-80 bg-primary-deep text-white flex flex-col min-h-screen border-r border-primary-brand/30 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-primary-brand/30">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="bg-white text-primary-deep p-2 rounded-xl">
            <ShieldCheck className="h-7 w-7 text-primary-brand" />
          </div>
          <div>
            <span className="block text-xl font-extrabold leading-none tracking-tight">AYUDA MUTUA</span>
            <span className="block text-xs font-semibold text-accent-tech tracking-widest uppercase">ADMINISTRACIÓN</span>
          </div>
        </Link>
      </div>

      {/* Admin Quick Profile */}
      <div className="p-6 border-b border-primary-brand/20 bg-primary-brand/10">
        <div className="flex items-center gap-3">
          <div className="bg-accent-tech text-primary-deep rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
            AD
          </div>
          <div>
            <span className="block text-base font-bold">Lic. Ana Díaz</span>
            <span className="block text-xs text-blue-200">Administrador de Fideicomiso</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3" aria-label="Menú administrativo">
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 font-semibold text-lg px-4 py-3.5 rounded-xl transition-all ${
            isActive('/admin/dashboard')
              ? 'bg-primary-brand text-white shadow-md'
              : 'text-blue-100 hover:bg-primary-brand/35 hover:text-white'
          }`}
        >
          <LayoutDashboard className="h-5 w-5 text-accent-tech" />
          <span>Dashboard Principal</span>
        </Link>

        <Link
          to="/admin/aportaciones"
          className={`flex items-center gap-3 font-semibold text-lg px-4 py-3.5 rounded-xl transition-all ${
            isActive('/admin/aportaciones')
              ? 'bg-primary-brand text-white shadow-md'
              : 'text-blue-100 hover:bg-primary-brand/35 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="h-5 w-5 text-accent-tech" />
          <span>Aportaciones por Empresa</span>
        </Link>

        <Link
          to="/admin/tramites"
          className={`flex items-center gap-3 font-semibold text-lg px-4 py-3.5 rounded-xl transition-all ${
            isActive('/admin/tramites')
              ? 'bg-primary-brand text-white shadow-md'
              : 'text-blue-100 hover:bg-primary-brand/35 hover:text-white'
          }`}
        >
          <ClipboardList className="h-5 w-5 text-accent-tech" />
          <span>Control de Trámites</span>
        </Link>

        <Link
          to="/admin/directores"
          className={`flex items-center gap-3 font-semibold text-lg px-4 py-3.5 rounded-xl transition-all ${
            isActive('/admin/directores')
              ? 'bg-primary-brand text-white shadow-md'
              : 'text-blue-100 hover:bg-primary-brand/35 hover:text-white'
          }`}
        >
          <Briefcase className="h-5 w-5 text-accent-tech" />
          <span>Dashboard Directores</span>
        </Link>
      </nav>

      {/* Footer / Actions */}
      <div className="p-6 border-t border-primary-brand/20 space-y-3 bg-primary-brand/5">
        <Link
          to="/"
          className="flex items-center gap-3 text-blue-200 hover:text-white text-base py-2 transition-colors focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a la Web Pública</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-red-200 hover:text-red-100 hover:bg-red-900/30 font-semibold text-lg px-4 py-3 rounded-xl transition-all border border-red-500/20 hover:border-red-500/50 focus-visible:outline-none"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
