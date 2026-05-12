'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin error]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-6 p-8" style={{ color: '#E2E8F0' }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
        ⚠
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-white mb-2">Une erreur est survenue</h2>
        <p className="text-sm text-gray-400 max-w-sm">{error.message || 'Erreur inattendue. Rechargez la page.'}</p>
      </div>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-lg text-sm font-bold transition"
        style={{ background: '#00E5FF', color: '#060D1F' }}
      >
        Réessayer
      </button>
    </div>
  );
}
