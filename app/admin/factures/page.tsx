'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Facture {
  _id: string; numero: string; clientName: string; clientEmail: string;
  total: number; subtotal: number; tva: number; tvaAmount: number;
  status: string; echeance: string; createdAt: string; pdfUrl?: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
}

const EMPTY = {
  clientName: '', clientEmail: '', clientPhone: '', clientAddress: '',
  items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
  tva: 18, echeance: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
};

const STATUS_COLOR: Record<string, string> = { impayee: '#EF4444', payee: '#10B981', annulee: '#64748B' };
const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

export default function FacturesPage() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = () => api.get<{ data: Facture[] }>('/api/factures').then(r => setFactures(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/api/factures/${id}`, { status });
    setFactures(f => f.map(x => x._id === id ? { ...x, status } : x));
  };

  const save = async () => {
    await api.post('/api/factures', form);
    setShowForm(false); setForm(EMPTY); load();
  };

  const updateItem = (i: number, key: string, val: any) => {
    const items = [...form.items];
    items[i] = { ...items[i], [key]: val, total: key === 'quantity' ? val * items[i].unitPrice : key === 'unitPrice' ? val * items[i].quantity : items[i].total };
    setForm((p: any) => ({ ...p, items }));
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Factures</h1>
        <button onClick={() => { setForm(EMPTY); setShowForm(true); }}
          className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#00E5FF', color: '#060D1F' }}>
          + Nouvelle facture
        </button>
      </div>

      {loading ? <div className="text-gray-400 text-sm">Chargement...</div> : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0B1628' }}>
                {['Numéro', 'Client', 'Total', 'Statut', 'Échéance', 'PDF', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {factures.map((f, i) => (
                <tr key={f._id} className="border-t" style={{ borderColor: '#1E2D4A', background: i % 2 === 0 ? '#060D1F' : '#0B1628' }}>
                  <td className="px-4 py-3 text-cyan-400 font-mono text-xs">{f.numero}</td>
                  <td className="px-4 py-3 text-white">{f.clientName}</td>
                  <td className="px-4 py-3 text-white font-semibold">{fmt(f.total)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      style={{ background: STATUS_COLOR[f.status] + '22', color: STATUS_COLOR[f.status] }}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{f.echeance ? new Date(f.echeance).toLocaleDateString('fr-FR') : '—'}</td>
                  <td className="px-4 py-3">
                    <a href={`${API_BASE}/api/factures/${f._id}/pdf`} target="_blank" rel="noopener"
                      className="px-2 py-1 rounded text-xs" style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                      PDF
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {f.status !== 'payee' && (
                        <button onClick={() => updateStatus(f._id, 'payee')}
                          className="px-2 py-1 rounded text-xs" style={{ background: '#10B98122', color: '#10B981' }}>
                          Marquer payé
                        </button>
                      )}
                      {f.status !== 'annulee' && (
                        <button onClick={() => updateStatus(f._id, 'annulee')}
                          className="px-2 py-1 rounded text-xs" style={{ background: '#1E2D4A', color: '#64748B' }}>
                          Annuler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4 overflow-y-auto max-h-[90vh]" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Nouvelle facture</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ k: 'clientName', l: 'Nom client' }, { k: 'clientEmail', l: 'Email' }, { k: 'clientPhone', l: 'Téléphone' }, { k: 'clientAddress', l: 'Adresse' }].map(f => (
                <div key={f.k}>
                  <label className="block text-xs text-gray-400 mb-1">{f.l}</label>
                  <input value={form[f.k] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.k]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-400">Articles</label>
                <button onClick={() => setForm((p: any) => ({ ...p, items: [...p.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }] }))}
                  className="text-xs text-cyan-400">+ Ligne</button>
              </div>
              {form.items.map((it: any, i: number) => (
                <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                  <input placeholder="Description" value={it.description} onChange={e => updateItem(i, 'description', e.target.value)}
                    className="col-span-5 px-2 py-1.5 rounded text-white text-xs outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                  <input type="number" placeholder="Qté" value={it.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))}
                    className="col-span-2 px-2 py-1.5 rounded text-white text-xs outline-none text-center"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                  <input type="number" placeholder="Prix" value={it.unitPrice} onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))}
                    className="col-span-3 px-2 py-1.5 rounded text-white text-xs outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                  <div className="col-span-1 text-xs text-gray-500 text-right">{fmt(it.quantity * it.unitPrice)}</div>
                  <button onClick={() => setForm((p: any) => ({ ...p, items: p.items.filter((_: any, j: number) => j !== i) }))}
                    className="col-span-1 text-red-400 text-xs">✕</button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">TVA (%)</label>
                <input type="number" value={form.tva} onChange={e => setForm((p: any) => ({ ...p, tva: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Date d&apos;échéance</label>
                <input type="date" value={form.echeance} onChange={e => setForm((p: any) => ({ ...p, echeance: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>
            </div>
            <button onClick={save} className="w-full py-2.5 rounded-lg text-sm font-bold" style={{ background: '#00E5FF', color: '#060D1F' }}>
              Créer la facture
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
