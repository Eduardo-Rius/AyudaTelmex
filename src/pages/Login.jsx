import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, PhoneCall, ShieldCheck, ArrowLeft, ShieldAlert } from 'lucide-react';
import PublicHeader from '../components/layout/PublicHeader';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }

    // Mock Authentication Routing
    // Check if it's admin or associated
    if (username.toLowerCase().includes('admin')) {
      navigate('/admin/dashboard');
    } else {
      navigate('/asociado/dashboard');
    }
  };

  // Quick Demo Logins
  const loginAsAssociate = () => {
    navigate('/asociado/dashboard');
  };

  const loginAsAdmin = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Panel: Graphic & Help (5 Cols) */}
          <div className="md:col-span-5 space-y-6 text-left">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-brand hover:text-primary-deep font-bold text-base focus-visible:outline-none">
              <ArrowLeft className="h-4 w-4" /> Volver al Inicio
            </Link>
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-primary-deep tracking-tight">Zona de Accesos</h2>
              <p className="text-lg text-neutral-muted leading-relaxed">
                Consulte sus pólizas de previsión, estado del fondo de recuperación, convoque apoyos educativos o regístrese en actividades comunitarias de forma ágil y segura.
              </p>
            </div>

            {/* Support Box for Elders */}
            <div className="bg-white border border-gray-250 p-6 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="bg-primary-brand/10 p-3 rounded-xl text-primary-brand shrink-0">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-primary-deep text-lg">¿Necesita asistencia?</h4>
                <p className="text-sm text-neutral-muted leading-relaxed">
                  Llámenos al <span className="font-bold text-primary-deep">800-123-MUTUA</span>. Con gusto le guiaremos paso a paso para ingresar.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Form (7 Cols) */}
          <div className="md:col-span-7">
            <Card className="w-full">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary-deep">Ingreso al Portal</h3>
                <p className="text-base text-neutral-muted mt-1">Escriba su número de asociado o correo institucional.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3" role="alert">
                  <ShieldAlert className="h-6 w-6 text-red-600 shrink-0" />
                  <p className="text-base text-red-800 font-semibold">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6 text-left">
                {/* User Input */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-base font-bold text-neutral-dark">
                    Correo electrónico o Número de Asociado
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      autoComplete="username"
                      required
                      placeholder="Ej. 902847 o nombre@correo.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-primary-brand focus:ring-1 focus:ring-primary-brand text-lg font-semibold min-h-[50px] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-base font-bold text-neutral-dark">
                      Contraseña
                    </label>
                    <a href="#olvide" className="text-sm font-bold text-primary-brand hover:underline">
                      ¿Olvidó su contraseña?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder="Ingrese su clave"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-primary-brand focus:ring-1 focus:ring-primary-brand text-lg font-semibold min-h-[50px] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <Button type="submit" variant="primary" className="w-full py-4 text-xl">
                  Ingresar
                </Button>
              </form>

              {/* DEMO SHORTCUTS - VERY USEFUL FOR DEMO PRESENTATION */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <span className="block text-center text-sm font-bold text-neutral-muted mb-4 uppercase tracking-wider">
                  Accesos Rápidos de Demostración (Reunión Ejecutiva)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={loginAsAssociate}
                    className="flex flex-col items-center justify-center p-4 bg-primary-deep/5 hover:bg-primary-deep/10 border border-primary-brand/35 rounded-2xl text-primary-deep hover:text-primary-deep font-bold transition-all text-base focus-visible:outline-none"
                  >
                    <span className="text-base text-primary-deep">Ingresar como</span>
                    <span className="text-lg text-primary-brand font-black">Asociado (Eduardo Rius)</span>
                  </button>
                  
                  <button
                    onClick={loginAsAdmin}
                    className="flex flex-col items-center justify-center p-4 bg-success-trust/5 hover:bg-success-trust/10 border border-success-trust/30 rounded-2xl text-success-trust hover:text-[#008f65] font-bold transition-all text-base focus-visible:outline-none"
                  >
                    <span className="text-base text-success-trust">Ingresar como</span>
                    <span className="text-lg text-[#008f65] font-black">Administrador (Ana Díaz)</span>
                  </button>
                </div>
              </div>

            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
