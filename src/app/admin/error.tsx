'use client';

import { useEffect } from 'react';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080818] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Error en el Panel
        </h1>
        <p className="text-sm text-white/40 mb-6 leading-relaxed">
          Ocurri&oacute; un error inesperado al cargar el panel de administraci&oacute;n.
          Esto puede ser temporal &mdash; intenta recargar la p&aacute;gina.
        </p>
        {error.message && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-red-400 font-mono break-all">{error.message}</p>
          </div>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2D78] to-[#a855f7] text-white font-semibold text-sm hover:opacity-90 transition-all inline-flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      </div>
    </div>
  );
}
