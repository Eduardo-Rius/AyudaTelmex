import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import Home from './pages/Home';
import Login from './pages/Login';
import AsociadoDashboard from './pages/AsociadoDashboard';
import RecuperacionCuotas from './pages/RecuperacionCuotas';
import AsociadoEventos from './pages/AsociadoEventos';
import AsociadoEstadoCuenta from './pages/AsociadoEstadoCuenta';
import AsociadoDocumentos from './pages/AsociadoDocumentos';
import AsociadoPerfil from './pages/AsociadoPerfil';
import AsociadoNuevoTramite from './pages/AsociadoNuevoTramite';
import AdminDashboard from './pages/AdminDashboard';
import AdminAportaciones from './pages/AdminAportaciones';
import AdminTramites from './pages/AdminTramites';
import AdminDirectores from './pages/AdminDirectores';
import ErrorBoundary from './components/common/ErrorBoundary';
import AsociadoSeguroVida from './pages/AsociadoSeguroVida';
import AdminBeneficiarios from './pages/AdminBeneficiarios';

// Component to restore scroll position to top on every route transition
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Toaster richColors position="top-right" duration={4000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/asociado/dashboard" element={<ErrorBoundary><AsociadoDashboard /></ErrorBoundary>} />
          <Route path="/asociado/recuperacion-cuotas" element={<ErrorBoundary><RecuperacionCuotas /></ErrorBoundary>} />
          <Route path="/asociado/eventos" element={<ErrorBoundary><AsociadoEventos /></ErrorBoundary>} />
          <Route path="/asociado/estado-cuenta" element={<ErrorBoundary><AsociadoEstadoCuenta /></ErrorBoundary>} />
          <Route path="/asociado/seguro-vida" element={<ErrorBoundary><AsociadoSeguroVida /></ErrorBoundary>} />
          <Route path="/admin/beneficiarios" element={<ErrorBoundary><AdminBeneficiarios /></ErrorBoundary>} />
          <Route path="/asociado/documentos" element={<ErrorBoundary><AsociadoDocumentos /></ErrorBoundary>} />
          <Route path="/asociado/perfil" element={<ErrorBoundary><AsociadoPerfil /></ErrorBoundary>} />
          <Route path="/asociado/nuevo-tramite/:tipo" element={<ErrorBoundary><AsociadoNuevoTramite /></ErrorBoundary>} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/aportaciones" element={<AdminAportaciones />} />
          <Route path="/admin/tramites" element={<AdminTramites />} />
          <Route path="/admin/directores" element={<AdminDirectores />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

