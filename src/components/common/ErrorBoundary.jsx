import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-6 text-left font-sans">
          <div className="bg-[#111827] border border-red-500/30 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4 border-b border-red-500/20 pb-4">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Contingencia de Seguridad React</h2>
                <span className="text-xxs font-extrabold text-red-400 uppercase tracking-widest block mt-0.5">
                  Protección Activa de Integridad Rius AI
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Se detectó una excepción de ejecución en la interfaz. El motor de seguridad ha suspendido el proceso de manera preventiva para resguardar las claves de firma digital (FIEL) y evitar transacciones huérfanas en el fideicomiso.
              </p>

              {this.state.error && (
                <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 text-left">
                  <span className="block text-xxs font-bold text-gray-500 uppercase tracking-wider mb-2">Detalles del Error</span>
                  <p className="text-xs font-mono text-red-400 font-bold leading-normal break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-3">
                      <summary className="text-[10px] font-bold text-gray-500 hover:text-gray-400 cursor-pointer select-none outline-none">
                        Ver traza de pila (Stack Trace)
                      </summary>
                      <pre className="mt-2 text-[9px] font-mono text-gray-400 leading-relaxed overflow-x-auto max-h-[150px] whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-800">
              <span className="text-[10px] text-gray-500 font-mono">
                Hash de Sesión: {Math.random().toString(16).substring(2, 10).toUpperCase()}
              </span>
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer text-sm shadow-md active:scale-98"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reiniciar Consola de Control</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
