'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Commande {
  _id: string; reference: string; clientName: string; clientEmail: string;
  clientPhone: string; total: number; status: string; createdAt: string;
  items: { name: string; quantity: number; unitPrice: number }[];
}

const STATUTS = ['nouveau', 'en_cours', 'livre', 'annule'];
const COLORS: Record<string, string> = { nouveau: '#00E5FF', en_cours: '#F59E0B', livre: '#10B981', annule: '#EF4444' };
const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [selected, setSelected] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => api.get<{ data: Commande[] }>('/api/commandes').then(r => setCommandes(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/api/commandes/${id}`, { status });
    setCommandes(c => c.map(x => x._id === id ? { ...x, status } : x));
  };

  const grouped = STATUTS.reduce((acc, s) => ({ ...acc, [s]: commandes.filter(c => c.status === s) }), {} as Record<string, Commande[]>);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Commandes</h1>

      {loading ? <div className="text-gray-400 text-sm">Chargement...</div> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUTS.map(statut => (
            <div key={statut} className="rounded-xl p-4" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[statut] }} />
                <span className="text-sm font-semibold capitalize text-gray-300">{statut.replace('_', ' ')}</span>
                <span className="ml-auto text-xs text-gray-500">{grouped[statut].length}</span>
              </div>
              <div className="space-y-2">
                {grouped[statut].map(cmd => (
                  <div key={cmd._id} onClick={() => setSelected(cmd)} className="cursor-pointer p-3 rounded-lg hover:border-cyan-400 transition-all"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div className="text-xs text-cyan-400 font-mono">{cmd.reference}</div>
                    <div className="text-sm text-white font-medium mt-0.5">{cmd.clientName}</div>
                    <div className="text-xs text-gray-400">{fmt(cmd.total)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
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
              <div>Date : <span className="text-white">{new Date(selected.createdAt).toLocaleDateString('fr-FR')}</span></div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Articles</div>
              {selected.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5 border-b" style={{ borderColor: '#1E2D4A' }}>
                  <span className="text-gray-300">{it.name} x{it.quantity}</span>
                  <span className="text-white">{fmt(it.unitPrice * it.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold pt-2">
                <span className="text-white">Total</span>
                <span className="text-cyan-400">{fmt(selected.total)}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Changer le statut</div>
              <div className="flex gap-2 flex-wrap">
                {STATUTS.map(s => (
                  <button key={s} onClick={() => { updateStatus(selected._id, s); setSelected({ ...selected, status: s }); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                    style={{ background: selected.status === s ? COLORS[s] : '#1E2D4A', color: selected.status === s ? '#060D1F' : '#94A3B8' }}>
                    {s.replace('_', ' ')}
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
