'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Devis {
  _id: string; reference: string; clientName: string; clientEmail: string;
  clientPhone: string; serviceType: string; description: string;
  budget: string; status: string; createdAt: string;
}

const STATUTS = ['nouveau', 'contacte', 'accepte', 'refuse', 'complete'];
const COLORS: Record<string, string> = { nouveau: '#00E5FF', contacte: '#F59E0B', accepte: '#10B981', refuse: '#EF4444', complete: '#A855F7' };

export default function DevisPage() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [selected, setSelected] = useState<Devis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Devis[] }>('/api/devis').then(r => setDevis(r.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/api/devis/${id}`, { status });
    setDevis(d => d.map(x => x._id === id ? { ...x, status } : x));
  };

  const grouped = STATUTS.reduce((acc, s) => ({ ...acc, [s]: devis.filter(d => d.status === s) }), {} as Record<string, Devis[]>);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Devis</h1>

      {loading ? <div className="text-gray-400 text-sm">Chargement...</div> : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUTS.map(statut => (
            <div key={statut} className="rounded-xl p-4 flex-shrink-0 w-56" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[statut] }} />
                <span className="text-sm font-semibold capitalize text-gray-300">{statut}</span>
                <span className="ml-auto text-xs text-gray-500">{grouped[statut].length}</span>
              </div>
              <div className="space-y-2">
                {grouped[statut].map(d => (
                  <div key={d._id} onClick={() => setSelected(d)} className="cursor-pointer p-3 rounded-lg hover:border-cyan-400 transition-all"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div className="text-xs text-cyan-400 font-mono">{d.reference}</div>
                    <div className="text-sm text-white font-medium mt-0.5">{d.clientName}</div>
                    <div className="text-xs text-gray-400 capitalize">{d.serviceType}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-cyan-400 font-mono">{selected.reference}</div>
                <div className="text-lg font-bold text-white">{selected.clientName}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Email : <span className="text-white">{selected.clientEmail}</span></div>
              <div>Téléphone : <span className="text-white">{selected.clientPhone}</span></div>
              <div>Service : <span className="text-white capitalize">{selected.serviceType}</span></div>
              <div>Budget : <span className="text-white">{selected.budget || 'Non précisé'}</span></div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Description</div>
              <p className="text-sm text-gray-300 bg-black/20 rounded-lg p-3">{selected.description}</p>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Changer le statut</div>
              <div className="flex gap-2 flex-wrap">
                {STATUTS.map(s => (
                  <button key={s} onClick={() => { updateStatus(selected._id, s); setSelected({ ...selected, status: s }); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                    style={{ background: selected.status === s ? COLORS[s] : '#1E2D4A', color: selected.status === s ? '#060D1F' : '#94A3B8' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
