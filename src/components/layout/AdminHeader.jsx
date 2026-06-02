import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Bell, X, User, CheckCircle2, XCircle, AlertTriangle, Send, Sun, Moon, Search } from 'lucide-react';

const SEARCHABLE_ITEMS = [
  { label: 'Eduardo Rius (Asociado)', category: 'Asociado', link: '/admin/dashboard' },
  { label: 'TR-3920 - Recuperación de Cuotas (Trámite)', category: 'Trámite', link: '/admin/tramites' },
  { label: 'TR-8492 - Actualización de Beneficiarios (Trámite)', category: 'Trámite', link: '/admin/tramites' },
  { label: 'TR-1082 - Premio Académico (Trámite)', category: 'Trámite', link: '/admin/tramites' },
  { label: 'Consorcio Red Uno S.A. de C.V. (Empresa)', category: 'Empresa', link: '/admin/aportaciones' },
  { label: 'Uno TV S.A. de C.V. (Empresa)', category: 'Empresa', link: '/admin/aportaciones' },
  { label: 'PwC Auditoría 2025 (Auditoría)', category: 'Auditoría', link: '/admin/directores' }
];

export default function AdminHeader() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Detect theme on mount
  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains('dark') || localStorage.theme === 'dark';
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
      toast.success('Modo Operativo (Claro) activado');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
      toast.success('Modo Ejecutivo (Oscuro) activado');
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = SEARCHABLE_ITEMS.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleSelectResult = (item) => {
    setSearchQuery('');
    setSearchResults([]);
    navigate(item.link);
    toast.info(`Navegando a: ${item.label}`);
  };

  const notifications = [
    { id: 1, title: 'Trámite T-8930 rechazado', time: 'Hace 5 min', type: 'error' },
    { id: 2, title: 'Periodo Mayo conciliado', time: 'Hace 10 min', type: 'success' },
    { id: 3, title: 'Recordatorio enviado a Uninet', time: 'Hace 1 hora', type: 'info' },
    { id: 4, title: 'Nueva inconsistencia detectada', time: 'Hace 2 horas', type: 'warning' },
  ];

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between z-30 shadow-xs h-20 shrink-0">
        
        {/* Left Side: Global Search (Tarea 3) */}
        <div className="relative w-72 sm:w-96 text-left">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Buscar asociado, trámite, empresa, auditoría..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:border-primary-brand focus-visible:outline-none min-h-[38px] bg-gray-50/50"
            />
          </div>
          
          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-hidden animate-scale-up">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex flex-col border-b border-gray-100 last:border-0 cursor-pointer"
                >
                  <span className="text-xs font-bold text-neutral-dark leading-tight">{result.label}</span>
                  <span className="text-[10px] text-neutral-muted uppercase tracking-wider font-extrabold mt-0.5">{result.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Profile, Bell & Theme Toggle (Tarea 1 & 8) */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Dark Mode Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 text-neutral-muted hover:text-primary-brand transition-all duration-300 ease focus-visible:outline-none cursor-pointer"
            aria-label="Alternar Modo Oscuro"
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Bell Icon Button */}
          <button 
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 text-neutral-muted hover:text-primary-brand transition-all duration-300 ease focus-visible:outline-none cursor-pointer"
            aria-label="Ver notificaciones"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-6 h-10">
            <div className="h-10 w-10 bg-primary-deep/5 text-primary-deep rounded-full flex items-center justify-center font-bold">
              <User className="h-5 w-5 text-primary-brand" />
            </div>
            <div className="text-left hidden md:block">
              <span className="block text-sm font-bold text-neutral-dark leading-tight">Lic. Ana Díaz</span>
              <span className="block text-xxs text-neutral-muted uppercase tracking-wider font-semibold">Administrador</span>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Drawer Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Notification Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-primary-deep text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent-tech" />
            <span>Notificaciones</span>
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-white focus-visible:outline-none cursor-pointer"
            aria-label="Cerrar notificaciones"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 rounded-xl border border-gray-150 hover:border-primary-brand/30 bg-gray-50/50 hover:bg-white transition-all duration-300 ease flex gap-3 text-sm text-left">
              {n.type === 'error' && <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />}
              {n.type === 'success' && <CheckCircle2 className="h-5 w-5 text-success-trust shrink-0 mt-0.5" />}
              {n.type === 'warning' && <AlertTriangle className="h-5 w-5 text-warning-alert shrink-0 mt-0.5" />}
              {n.type === 'info' && <Send className="h-5 w-5 text-primary-brand shrink-0 mt-0.5" />}
              <div className="space-y-1">
                <p className="font-bold text-neutral-dark leading-snug">{n.title}</p>
                <span className="block text-xxs text-neutral-muted font-semibold">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
