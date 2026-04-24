'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Item {
  title: string; price: number; quantity: number; digital?: boolean; image?: string;
}
interface TimelineEvent {
  event: string; by: string; date: string;
}
interface Commande {
  _id: string;
  reference: string;
  trackingCode?: string;
  trackingUrl?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  clientQuartier?: string;
  address?: string;
  quartier?: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  status: string;
  paymentMode: string;
  paymentProvider?: string;
  createdAt: string;
  items: Item[];
  timeline?: TimelineEvent[];
  facturePublicToken?: string;
}

const STATUTS = ['nouveau', 'confirme', 'en_livraison', 'livre', 'annule'];
const STATUTS_ALL = ['nouveau', 'confirme', 'en_cours', 'en_livraison', 'livre', 'annule'];

const STATUS_LABEL: Record<string, string> = {
  nouveau: 'Nouveau', confirme: 'Confirmé', en_cours: 'En cours',
  en_livraison: 'En livraison', livre: 'Livré', annule: 'Annulé',
};
const STATUS_COLOR: Record<string, string> = {
  nouveau: '#00E5FF', confirme: '#A855F7', en_cours: '#F59E0B',
  en_livraison: '#FF6B00', livre: '#10B981', annule: '#EF4444',
};

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [selected, setSelected] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('tous');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'kanban' | 'table'>('table');
  const [saving, setSaving] = useState(false);

  const load = () => {
    const params = new URLSearchParams({ limit: '100' });
    if (filterStatus !== 'tous') params.set('status', filterStatus);
    if (search) params.set('search', search);
    api.get<{ data: Commande[] }>(`/api/commandes?${params}`)
      .then(r => setCommandes(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterStatus, search]);

  const updateStatus = async (id: string, status: string) => {
    setSaving(true);
    await api.patch(`/api/commandes/${id}`, { status });
    setCommandes(c => c.map(x => x._id === id ? { ...x, status } : x));
    if (selected?._id === id) setSelected(s => s ? { ...s, status } : null);
    setSaving(false);
  };

  const quartier = (c: Commande) => c.clientQuartier || c.quartier || '';
  const address = (c: Commande) => c.clientAddress || c.address || '';

  const grouped = STATUTS.reduce((acc, s) => ({
    ...acc,
    [s]: commandes.filter(c => c.status === s || (s === 'nouveau' && c.status === 'nouveau')),
  }), {} as Record<string, Commande[]>);

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Commandes</h1>
          <p className="text-sm text-gray-500">{commandes.length} commande{commandes.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher nom, tél, réf..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-52"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
          />
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#1E2D4A' }}>
            {(['table', 'kanban'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-2 text-xs font-medium capitalize transition"
                style={{ background: view === v ? '#00E5FF' : '#0B1628', color: view === v ? '#060D1F' : '#94A3B8' }}>
                {v === 'table' ? '📋 Liste' : '🗂 Kanban'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtres statut */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ v: 'tous', label: 'Tous', count: commandes.length }, ...STATUTS_ALL.map(s => ({
          v: s, label: STATUS_LABEL[s], count: commandes.filter(c => c.status === s).length,
        }))].map(f => (
          <button key={f.v} onClick={() => setFilterStatus(f.v)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
            style={{
              background: filterStatus === f.v ? (STATUS_COLOR[f.v] || '#00E5FF') : '#1E2D4A',
              color: filterStatus === f.v ? '#060D1F' : '#94A3B8',
            }}>
            {f.label}
            <span className="text-[10px] opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Chargement...</div>
      ) : commandes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-20">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-sm">Aucune commande{filterStatus !== 'tous' ? ' dans ce statut' : ''}.</p>
        </div>
      ) : view === 'table' ? (
        /* ── VUE TABLE ── */
        <div className="flex-1 overflow-auto rounded-xl" style={{ border: '1px solid #1E2D4A' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#0B1628', borderBottom: '1px solid #1E2D4A' }}>
              <tr>
                {['Réf / Suivi', 'Client', 'Articles', 'Total', 'Quartier', 'Paiement', 'Statut', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commandes.map((cmd, i) => (
                <tr key={cmd._id} onClick={() => setSelected(cmd)} className="cursor-pointer transition-colors"
                  style={{ background: i % 2 === 0 ? '#060D1F' : '#070E1F', borderBottom: '1px solid #0d1a2e' }}>
                  <td className="px-4 py-3">
                    <div className="text-xs font-mono text-cyan-400">{cmd.reference}</div>
                    {cmd.trackingCode && <div className="text-[10px] text-gray-500 font-mono">{cmd.trackingCode}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{cmd.clientName}</div>
                    <div className="text-xs text-gray-400">{cmd.clientPhone}</div>
                    {cmd.clientEmail && <div className="text-xs text-gray-500">{cmd.clientEmail}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-300 max-w-[160px] truncate">
                      {cmd.items.map(i => i.title).join(', ')}
                    </div>
                    <div className="text-[10px] text-gray-500">{cmd.items.length} article{cmd.items.length > 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-cyan-400 whitespace-nowrap">{fmt(cmd.total)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{quartier(cmd) || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: cmd.paymentMode === 'online' ? '#00E5FF' : '#FF6B00' }}>
                      {cmd.paymentMode === 'online' ? '💳 En ligne' : '🚚 Livraison'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: STATUS_COLOR[cmd.status] + '22', color: STATUS_COLOR[cmd.status] }}>
                      {STATUS_LABEL[cmd.status] || cmd.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(cmd.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={e => { e.stopPropagation(); setSelected(cmd); }}
                      className="px-2 py-1 rounded text-[10px] font-medium transition"
                      style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── VUE KANBAN ── */
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {STATUTS.map(statut => (
              <div key={statut} className="w-64 rounded-xl flex flex-col" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
                <div className="flex items-center gap-2 p-4 border-b" style={{ borderColor: '#1E2D4A' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[statut] }} />
                  <span className="text-sm font-semibold text-gray-300">{STATUS_LABEL[statut]}</span>
                  <span className="ml-auto text-xs text-gray-500 bg-[#060D1F] px-2 py-0.5 rounded-full">
                    {grouped[statut]?.length || 0}
                  </span>
                </div>
                <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-[60vh]">
                  {(grouped[statut] || []).map(cmd => (
                    <div key={cmd._id} onClick={() => setSelected(cmd)} className="cursor-pointer p-3 rounded-lg transition-all hover:border-cyan-400/50"
                      style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                      <div className="text-[10px] text-cyan-400 font-mono mb-1">{cmd.reference}</div>
                      <div className="text-sm text-white font-medium">{cmd.clientName}</div>
                      <div className="text-xs text-gray-400">{cmd.clientPhone}</div>
                      <div className="text-xs text-cyan-400 font-mono font-bold mt-2">{fmt(cmd.total)}</div>
                      {quartier(cmd) && <div className="text-[10px] text-gray-500 mt-1">📍 {quartier(cmd)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL DÉTAIL ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>

            {/* Modal header */}
            <div className="flex items-start justify-between p-6 border-b sticky top-0 z-10" style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
              <div>
                <div className="text-xs text-cyan-400 font-mono mb-0.5">{selected.reference}</div>
                <div className="text-xl font-bold text-white">{selected.clientName}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: STATUS_COLOR[selected.status] + '22', color: STATUS_COLOR[selected.status] }}>
                    {STATUS_LABEL[selected.status] || selected.status}
                  </span>
                  <span className="text-xs text-gray-500">{fmtDate(selected.createdAt)}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}>✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Bloc infos client */}
              <section>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">👤 Informations client</h3>
                <div className="rounded-xl p-4 space-y-2" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-0.5">Nom</div>
                      <div className="text-sm text-white font-semibold">{selected.clientName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-0.5">Téléphone</div>
                      <div className="text-sm text-white">
                        <a href={`tel:${selected.clientPhone}`} className="hover:text-cyan-400 transition">{selected.clientPhone}</a>
                        {' '}
                        <a href={`https://wa.me/225${selected.clientPhone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                          className="text-[10px] text-green-400 hover:underline">WhatsApp →</a>
                      </div>
                    </div>
                    {selected.clientEmail && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase mb-0.5">Email</div>
                        <div className="text-sm text-white">{selected.clientEmail}</div>
                      </div>
                    )}
                    {quartier(selected) && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase mb-0.5">Quartier</div>
                        <div className="text-sm text-white">📍 {quartier(selected)}</div>
                      </div>
                    )}
                  </div>
                  {address(selected) && (
                    <div className="pt-2 border-t" style={{ borderColor: '#1E2D4A' }}>
                      <div className="text-[10px] text-gray-500 uppercase mb-0.5">Adresse complète</div>
                      <div className="text-sm text-gray-300">{address(selected)}</div>
                    </div>
                  )}
                </div>
              </section>

              {/* Bloc produits */}
              <section>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">📦 Articles commandés</h3>
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3"
                      style={{ background: i % 2 === 0 ? '#060D1F' : '#080F20', borderBottom: i < selected.items.length - 1 ? '1px solid #1E2D4A' : 'none' }}>
                      <div className="flex-1">
                        <div className="text-sm text-white font-medium">{item.title}</div>
                        {item.digital && <div className="text-[10px] text-green-400">⚡ Produit digital</div>}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xs text-gray-400">× {item.quantity || 1}</div>
                        <div className="text-sm font-mono font-bold text-cyan-400">
                          {fmt((item.price || 0) * (item.quantity || 1))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Récap prix */}
              <section>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">💰 Récapitulatif</h3>
                <div className="rounded-xl p-4 space-y-2" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Sous-total</span><span className="font-mono">{fmt(selected.subtotal || 0)}</span>
                  </div>
                  {selected.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>🚚 Frais livraison</span><span className="font-mono text-orange-400">+{fmt(selected.deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Mode de paiement</span>
                    <span style={{ color: selected.paymentMode === 'online' ? '#00E5FF' : '#FF6B00' }}>
                      {selected.paymentMode === 'online' ? '💳 En ligne' : '🚚 À la livraison'}
                    </span>
                  </div>
                  <div className="pt-2 border-t flex justify-between" style={{ borderColor: '#1E2D4A' }}>
                    <span className="font-bold text-white">TOTAL</span>
                    <span className="text-xl font-black font-mono text-cyan-400">{fmt(selected.total)}</span>
                  </div>
                </div>
              </section>

              {/* Suivi */}
              {selected.trackingCode && (
                <section>
                  <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">🔍 Suivi</h3>
                  <div className="rounded-xl p-4" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-[10px] text-gray-500 mb-0.5">Code de suivi</div>
                        <div className="text-lg font-black font-mono text-cyan-400">{selected.trackingCode}</div>
                      </div>
                      {selected.trackingUrl && (
                        <button onClick={() => { navigator.clipboard.writeText(selected.trackingUrl!); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                          style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                          📋 Copier le lien
                        </button>
                      )}
                    </div>
                    {selected.trackingUrl && (
                      <a href={selected.trackingUrl} target="_blank" rel="noreferrer"
                        className="text-xs text-cyan-400 hover:underline break-all">
                        {selected.trackingUrl}
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Changer le statut */}
              <section>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">🔄 Changer le statut</h3>
                <div className="flex gap-2 flex-wrap">
                  {STATUTS_ALL.map(s => (
                    <button key={s} disabled={saving} onClick={() => updateStatus(selected._id, s)}
                      className="px-3 py-2 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: selected.status === s ? STATUS_COLOR[s] : STATUS_COLOR[s] + '15',
                        color: selected.status === s ? '#060D1F' : STATUS_COLOR[s],
                        border: `1px solid ${STATUS_COLOR[s]}40`,
                        opacity: saving ? 0.6 : 1,
                      }}>
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </section>

              {/* Timeline */}
              {selected.timeline && selected.timeline.length > 0 && (
                <section>
                  <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">📅 Historique</h3>
                  <div className="space-y-2">
                    {[...selected.timeline].reverse().map((ev, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#00E5FF' }} />
                        <div className="flex-1">
                          <div className="text-gray-300">{ev.event}</div>
                          <div className="text-[10px] text-gray-500">
                            {ev.by} · {new Date(ev.date).toLocaleString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Actions */}
              <section>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">⚡ Actions rapides</h3>
                <div className="flex gap-2 flex-wrap">
                  <a href={`tel:${selected.clientPhone}`}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition"
                    style={{ background: '#0099FF20', color: '#0099FF', border: '1px solid #0099FF40' }}>
                    📞 Appeler
                  </a>
                  <a href={`https://wa.me/225${selected.clientPhone.replace(/\D/g,'')}?text=Bonjour%20${encodeURIComponent(selected.clientName)}%2C%20concernant%20votre%20commande%20${selected.reference}`}
                    target="_blank" rel="noreferrer"
                    className="px-3 py-2 rounded-lg text-xs font-medium transition"
                    style={{ background: '#25D36620', color: '#25D366', border: '1px solid #25D36640' }}>
                    💬 WhatsApp
                  </a>
                  {selected.clientEmail && (
                    <a href={`mailto:${selected.clientEmail}?subject=Commande ${selected.reference}`}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition"
                      style={{ background: '#F59E0B20', color: '#F59E0B', border: '1px solid #F59E0B40' }}>
                      ✉️ Email
                    </a>
                  )}
                  {quartier(selected) && (
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent((quartier(selected) + ' ' + address(selected)).trim() + ', Abidjan')}`}
                      target="_blank" rel="noreferrer"
                      className="px-3 py-2 rounded-lg text-xs font-medium transition"
                      style={{ background: '#10B98120', color: '#10B981', border: '1px solid #10B98140' }}>
                      🗺️ Google Maps
                    </a>
                  )}
                  {selected.facturePublicToken && (
                    <a href={`${process.env.NEXT_PUBLIC_API_URL || 'https://sora-tech-website-production.up.railway.app'}/api/factures/public/${selected.facturePublicToken}`}
                      target="_blank" rel="noreferrer"
                      className="px-3 py-2 rounded-lg text-xs font-medium transition"
                      style={{ background: '#EF444420', color: '#EF4444', border: '1px solid #EF444440' }}>
                      📄 Facture PDF
                    </a>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
