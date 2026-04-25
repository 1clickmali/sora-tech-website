'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface FactureItem {
  description: string; quantity: number; unitPrice: number; total: number;
}
interface Facture {
  _id: string; numero: string;
  commandeRef?: string; trackingCode?: string;
  clientName: string; clientEmail?: string; clientPhone?: string;
  clientAddress?: string; clientQuartier?: string;
  items: FactureItem[];
  subtotal: number; deliveryFee?: number; tva?: number; tvaAmount?: number; total: number;
  paymentMode?: string; paymentStatus: string;
  pdfFilename?: string; publicToken?: string;
  notes?: string; echeance?: string; issuedAt?: string; createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  impayee: '#EF4444', payee: '#10B981', annulee: '#64748B',
};
const STATUS_LABEL: Record<string, string> = {
  impayee: 'Impayée', payee: 'Payée', annulee: 'Annulée',
};
const PAYMENT_LABEL: Record<string, string> = {
  cod: 'À la livraison', online: 'En ligne', virement: 'Virement', autre: 'Autre',
};

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const EMPTY_FORM = {
  clientName: '', clientEmail: '', clientPhone: '', clientAddress: '', clientQuartier: '',
  items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
  tva: 0, notes: '',
  echeance: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
};

export default function FacturesPage() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Facture | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (filter !== 'tous') params.set('status', filter);
      if (search) params.set('search', search);
      const r = await api.get<{ data: Facture[]; total: number }>(`/api/factures?${params}`);
      setFactures(r.data);
      setTotal(r.total);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const markPaid = async (id: string) => {
    await api.patch(`/api/factures/${id}`, { paymentStatus: 'payee', paidAt: new Date() });
    setFactures(f => f.map(x => x._id === id ? { ...x, paymentStatus: 'payee' } : x));
    if (selected?._id === id) setSelected(s => s ? { ...s, paymentStatus: 'payee' } : null);
  };

  const downloadPDF = async (id: string, numero: string) => {
    try {
      const token = localStorage.getItem('sora_token');
      const res = await fetch(`${API_BASE}/api/factures/${id}/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) { alert('Erreur lors du téléchargement'); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${numero}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Erreur réseau'); }
  };

  const updateItem = (i: number, key: string, val: any) => {
    const items = [...form.items];
    const updated = { ...items[i], [key]: val };
    updated.total = updated.quantity * updated.unitPrice;
    items[i] = updated;
    setForm((p: any) => ({ ...p, items }));
  };

  const calcSubtotal = () => form.items.reduce((s: number, it: any) => s + (it.quantity * it.unitPrice), 0);

  const saveForm = async () => {
    setSaving(true);
    try {
      await api.post('/api/factures', form);
      setShowForm(false);
      setForm(EMPTY_FORM);
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const impayees = factures.filter(f => f.paymentStatus === 'impayee');
  const payees = factures.filter(f => f.paymentStatus === 'payee');
  const montantImpaye = impayees.reduce((s, f) => s + f.total, 0);
  const montantTotal = factures.reduce((s, f) => s + f.total, 0);
  const thisMonth = factures.filter(f => {
    const d = new Date(f.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Factures</h1>
          <p className="text-sm text-gray-500">Facturation automatique et manuelle</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setShowForm(true); }}
          className="px-4 py-2 rounded-lg text-sm font-bold transition"
          style={{ background: '#00E5FF', color: '#060D1F' }}>
          + Nouvelle facture
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total factures', value: total, color: '#00E5FF', icon: '🧾' },
          { label: 'Impayées', value: impayees.length, sub: fmt(montantImpaye), color: '#EF4444', icon: '⚠️' },
          { label: 'Payées', value: payees.length, color: '#10B981', icon: '✅' },
          { label: 'Ce mois', value: thisMonth.length, color: '#A855F7', icon: '📅' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-xl relative overflow-hidden"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="absolute top-4 right-4 text-2xl opacity-20">{s.icon}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">{s.label}</div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
            {s.sub && <div className="text-xs text-gray-500 mt-1">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'tous', label: 'Toutes', count: factures.length },
            { key: 'impayee', label: 'Impayées', count: impayees.length },
            { key: 'payee', label: 'Payées', count: payees.length },
            { key: 'annulee', label: 'Annulées', count: factures.filter(f => f.paymentStatus === 'annulee').length },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
              style={{
                background: filter === f.key ? (STATUS_COLOR[f.key] || '#00E5FF') : '#1E2D4A',
                color: filter === f.key ? '#060D1F' : '#94A3B8',
              }}>
              {f.label}
              <span className="text-[10px] opacity-70">({f.count})</span>
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Chercher par N°, client..."
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0', minWidth: 220 }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-3 text-gray-400 text-sm mt-4">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          Chargement...
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-xl mt-5" style={{ border: '1px solid #1E2D4A' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#0B1628', borderBottom: '1px solid #1E2D4A' }}>
              <tr>
                {['Numéro', 'Client', 'Commande', 'Total', 'Mode', 'Statut', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {factures.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 text-sm">
                    Aucune facture trouvée
                  </td>
                </tr>
              ) : factures.map((f, i) => (
                <tr key={f._id} className="border-t cursor-pointer hover:opacity-80 transition"
                  style={{ background: i % 2 === 0 ? '#060D1F' : '#070E1F', borderBottom: '1px solid #0d1a2e' }}
                  onClick={() => setSelected(f)}>
                  <td className="px-4 py-3 text-cyan-400 font-mono text-xs font-bold">{f.numero}</td>
                  <td className="px-4 py-3">
                    <div className="text-white font-semibold">{f.clientName}</div>
                    {f.clientPhone && <div className="text-xs text-gray-500">{f.clientPhone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    {f.commandeRef
                      ? <span className="text-xs font-mono text-purple-400">{f.commandeRef}</span>
                      : <span className="text-xs text-gray-600">Manuelle</span>}
                  </td>
                  <td className="px-4 py-3 font-bold font-mono text-white">{fmt(f.total)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {PAYMENT_LABEL[f.paymentMode || ''] || f.paymentMode || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: STATUS_COLOR[f.paymentStatus] + '22', color: STATUS_COLOR[f.paymentStatus] }}>
                      {STATUS_LABEL[f.paymentStatus] || f.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(f.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1.5 items-center">
                      <button onClick={() => downloadPDF(f._id, f.numero)}
                        className="px-2 py-1 rounded text-xs font-medium cursor-pointer"
                        style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                        PDF
                      </button>
                      {f.paymentStatus === 'impayee' && (
                        <button onClick={() => markPaid(f._id)}
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ background: '#10B98122', color: '#10B981' }}>
                          Payée
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

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-start justify-between p-6 border-b sticky top-0 z-10"
              style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
              <div>
                <div className="text-xs text-cyan-400 font-mono mb-0.5">Facture</div>
                <div className="text-xl font-black font-mono text-white">{selected.numero}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: STATUS_COLOR[selected.paymentStatus] + '22', color: STATUS_COLOR[selected.paymentStatus] }}>
                    {STATUS_LABEL[selected.paymentStatus]}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}>✕</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Client */}
              <div className="rounded-xl p-4" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Client</div>
                <div className="text-white font-bold text-lg">{selected.clientName}</div>
                {selected.clientPhone && (
                  <a href={`tel:${selected.clientPhone}`} className="text-sm text-blue-400">{selected.clientPhone}</a>
                )}
                {selected.clientEmail && (
                  <div className="text-sm text-gray-400">{selected.clientEmail}</div>
                )}
                {selected.clientQuartier && (
                  <div className="text-sm text-gray-400 mt-1">Quartier : {selected.clientQuartier}</div>
                )}
                {selected.clientAddress && (
                  <div className="text-xs text-gray-500">{selected.clientAddress}</div>
                )}
              </div>

              {/* Commande liée */}
              {selected.commandeRef && (
                <div className="rounded-xl p-4 flex items-center justify-between"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Commande liée</div>
                    <div className="font-mono font-bold text-purple-400">{selected.commandeRef}</div>
                    {selected.trackingCode && (
                      <div className="text-xs text-gray-500 font-mono">{selected.trackingCode}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {PAYMENT_LABEL[selected.paymentMode || ''] || '—'}
                  </div>
                </div>
              )}

              {/* Articles */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
                <div className="px-4 py-2 border-b" style={{ background: '#0B1628', borderColor: '#1E2D4A' }}>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Articles</div>
                </div>
                {selected.items.map((it, i) => (
                  <div key={i} className="flex justify-between items-center px-4 py-2.5 text-sm border-b last:border-0"
                    style={{ background: i % 2 === 0 ? '#060D1F' : '#070E20', borderColor: '#1E2D4A' }}>
                    <div className="text-gray-300">{it.description}</div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">× {it.quantity}</div>
                      <div className="font-mono font-bold text-white">{fmt(it.total)}</div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3" style={{ background: '#0B1628' }}>
                  {(selected.deliveryFee || 0) > 0 && (
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Frais de livraison</span>
                      <span className="font-mono">+{fmt(selected.deliveryFee || 0)}</span>
                    </div>
                  )}
                  {(selected.tvaAmount || 0) > 0 && (
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>TVA ({selected.tva}%)</span>
                      <span className="font-mono">+{fmt(selected.tvaAmount || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-white">
                    <span>TOTAL</span>
                    <span className="text-xl font-black font-mono text-cyan-400">{fmt(selected.total)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => downloadPDF(selected._id, selected.numero)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                  style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                  Télécharger PDF
                </button>
                {selected.paymentStatus === 'impayee' && (
                  <button onClick={() => markPaid(selected._id)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                    style={{ background: '#10B981', color: '#fff' }}>
                    Marquer payée
                  </button>
                )}
              </div>

              {selected.notes && (
                <div className="text-xs text-gray-500 p-3 rounded-xl" style={{ background: '#060D1F' }}>
                  {selected.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Facture Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
              style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
              <h2 className="text-lg font-bold text-white">Nouvelle facture manuelle</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}>✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { k: 'clientName', l: 'Nom client *' },
                  { k: 'clientPhone', l: 'Téléphone' },
                  { k: 'clientEmail', l: 'Email' },
                  { k: 'clientQuartier', l: 'Quartier' },
                  { k: 'clientAddress', l: 'Adresse' },
                ].map(({ k, l }) => (
                  <div key={k}>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">{l}</label>
                    <input value={form[k] || ''} onChange={e => setForm((p: any) => ({ ...p, [k]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                      style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                  </div>
                ))}
              </div>

              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs text-gray-400 uppercase tracking-widest">Articles</div>
                  <button onClick={() => setForm((p: any) => ({ ...p, items: [...p.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }] }))}
                    className="text-xs text-cyan-400 font-semibold">+ Ligne</button>
                </div>
                {form.items.map((it: any, i: number) => (
                  <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <input placeholder="Description" value={it.description}
                      onChange={e => updateItem(i, 'description', e.target.value)}
                      className="col-span-5 px-2 py-1.5 rounded text-white text-xs outline-none"
                      style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                    <input type="number" min={1} placeholder="Qté" value={it.quantity}
                      onChange={e => updateItem(i, 'quantity', Number(e.target.value))}
                      className="col-span-2 px-2 py-1.5 rounded text-white text-xs outline-none text-center"
                      style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                    <input type="number" min={0} placeholder="Prix" value={it.unitPrice}
                      onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))}
                      className="col-span-3 px-2 py-1.5 rounded text-white text-xs outline-none"
                      style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                    <div className="col-span-1 text-xs text-gray-500 text-right font-mono">
                      {fmt(it.quantity * it.unitPrice)}
                    </div>
                    <button onClick={() => setForm((p: any) => ({ ...p, items: p.items.filter((_: any, j: number) => j !== i) }))}
                      className="col-span-1 text-red-400 text-xs">✕</button>
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <span className="text-sm font-bold text-white font-mono">
                    Total : {fmt(calcSubtotal())}
                  </span>
                </div>
              </div>

              {/* TVA + Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">TVA (%)</label>
                  <input type="number" min={0} value={form.tva}
                    onChange={e => setForm((p: any) => ({ ...p, tva: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Échéance</label>
                  <input type="date" value={form.echeance}
                    onChange={e => setForm((p: any) => ({ ...p, echeance: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Notes</label>
                <textarea value={form.notes} onChange={e => setForm((p: any) => ({ ...p, notes: e.target.value }))}
                  rows={2} className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>

              <button onClick={saveForm} disabled={saving || !form.clientName}
                className="w-full py-3 rounded-xl text-sm font-bold transition"
                style={{ background: saving ? '#1E2D4A' : '#00E5FF', color: saving ? '#64748B' : '#060D1F' }}>
                {saving ? 'Création...' : 'Créer la facture'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
