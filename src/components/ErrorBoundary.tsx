import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-red-100">
            <div className="inline-flex p-4 bg-red-50 text-red-500 rounded-full mb-6">
              <AlertTriangle size={48} />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">Algo salió mal</h1>
            <p className="text-gray-500 mb-8 text-lg">
              Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
              Por favor, intenta recargar la página.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                <RotateCcw size={20} />
                Recargar
              </button>

              <a
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-200"
              >
                <Home size={20} />
                Ir al Inicio
              </a>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-h-48 text-xs font-mono text-red-600 border border-gray-200">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
