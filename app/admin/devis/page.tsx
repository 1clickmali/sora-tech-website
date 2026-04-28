'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Devis {
  _id: string; reference: string; clientName: string; clientEmail: string;
  clientPhone: string; clientCompany?: string; serviceType: string;
  message?: string; complexity?: number; modules?: number;
  options?: Record<string, boolean>; estimatedPrice?: number;
  estimatedDays?: number; rdvDate?: string; rdvSlot?: string;
  status: string; createdAt: string;
}

const STATUTS = ['nouveau', 'contacte', 'accepte', 'refuse', 'complete'];
const SERVICE_LABEL: Record<string, string> = {
  web: 'Site web', soft: 'Logiciel gestion', app: 'App mobile',
  erp: 'ERP complet', cyber: 'Cybersécurité', maint: 'Maintenance',
};
const OPTION_LABEL: Record<string, string> = {
  mm: 'Paiement Mobile Money', multi: 'Multilingue (FR/EN)',
  client: 'Espace client sécurisé', seo: 'SEO avancé',
  wa: 'Chat WhatsApp', form: 'Formation équipe (4h)',
};
const fmtPrice = (n?: number) => n ? new Intl.NumberFormat('fr-FR').format(n) + ' FCFA' : '—';
const STATUS_LABEL: Record<string, string> = {
  nouveau: 'Nouveau', contacte: 'Contacté', accepte: 'Accepté', refuse: 'Refusé', complete: 'Complété',
};
const STATUS_COLOR: Record<string, string> = {
  nouveau: '#00E5FF', contacte: '#F59E0B', accepte: '#10B981', refuse: '#EF4444', complete: '#A855F7',
};

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function DevisPage() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [selected, setSelected] = useState<Devis | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('tous');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get<{ data: Devis[] }>('/api/devis').then(r => setDevis(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setSaving(true);
    await api.patch(`/api/devis/${id}`, { status });
    setDevis(d => d.map(x => x._id === id ? { ...x, status } : x));
    if (selected?._id === id) setSelected(s => s ? { ...s, status } : null);
    setSaving(false);
  };

  const filtered = devis.filter(d => {
    if (filterStatus !== 'tous' && d.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.clientName.toLowerCase().includes(q) ||
        d.clientEmail.toLowerCase().includes(q) ||
        d.reference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const grouped = STATUTS.reduce((acc, s) => ({ ...acc, [s]: devis.filter(d => d.status === s) }), {} as Record<string, Devis[]>);

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Devis</h1>
          <p className="text-sm text-gray-500">{devis.length} devis</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher nom, email, réf..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-52"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
          />
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#1E2D4A' }}>
            {(['table', 'kanban'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-2 text-xs font-medium transition"
                style={{ background: view === v ? '#00E5FF' : '#0B1628', color: view === v ? '#060D1F' : '#94A3B8' }}>
                {v === 'table' ? '📋 Liste' : '🗂 Kanban'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ v: 'tous', label: 'Tous', count: devis.length }, ...STATUTS.map(s => ({
          v: s, label: STATUS_LABEL[s], count: devis.filter(d => d.status === s).length,
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
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-20">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-sm">Aucun devis{filterStatus !== 'tous' ? ' dans ce statut' : ''}.</p>
        </div>
      ) : view === 'table' ? (
        <div className="flex-1 overflow-auto rounded-xl" style={{ border: '1px solid #1E2D4A' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#0B1628', borderBottom: '1px solid #1E2D4A' }}>
              <tr>
                {['Réf', 'Client', 'Service', 'Budget', 'Statut', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d._id} onClick={() => setSelected(d)} className="cursor-pointer transition-colors"
                  style={{ background: i % 2 === 0 ? '#060D1F' : '#070E1F', borderBottom: '1px solid #0d1a2e' }}>
                  <td className="px-4 py-3 text-xs font-mono text-cyan-400">{d.reference}</td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{d.clientName}</div>
                    <div className="text-xs text-gray-400">{d.clientEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{SERVICE_LABEL[d.serviceType] || d.serviceType}</td>
                  <td className="px-4 py-3 text-xs text-gray-300 font-mono">{fmtPrice(d.estimatedPrice)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: STATUS_COLOR[d.status] + '22', color: STATUS_COLOR[d.status] }}>
                      {STATUS_LABEL[d.status] || d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(d.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={e => { e.stopPropagation(); setSelected(d); }}
                      className="px-2 py-1 rounded text-[10px] font-medium"
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
                  {(grouped[statut] || []).map(d => (
                    <div key={d._id} onClick={() => setSelected(d)} className="cursor-pointer p-3 rounded-lg transition-all hover:border-cyan-400/50"
                      style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                      <div className="text-[10px] text-cyan-400 font-mono mb-1">{d.reference}</div>
                      <div className="text-sm text-white font-medium">{d.clientName}</div>
                      <div className="text-xs text-gray-400 capitalize">{d.serviceType}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-start justify-between p-6 border-b sticky top-0 z-10"
              style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
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
              {/* Client */}
              <section>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">👤 Informations client</h3>
                <div className="rounded-xl p-4" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
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
                        <a href={`https://wa.me/225${selected.clientPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                          className="text-[10px] text-green-400 hover:underline">WhatsApp →</a>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-0.5">Email</div>
                      <div className="text-sm text-white">{selected.clientEmail}</div>
                    </div>
                    {selected.clientCompany && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase mb-0.5">Entreprise</div>
                        <div className="text-sm text-white">{selected.clientCompany}</div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* RDV */}
              {(selected.rdvDate || selected.rdvSlot) && (
                <section>
                  <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">📅 Rendez-vous</h3>
                  <div className="rounded-xl p-4 flex items-center gap-6" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-0.5">Date</div>
                      <div className="text-sm text-white font-semibold">{selected.rdvDate || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-0.5">Heure</div>
                      <div className="text-sm text-cyan-400 font-mono font-bold">{selected.rdvSlot || '—'}</div>
                    </div>
                  </div>
                </section>
              )}

              {/* Devis details */}
              <section>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">📋 Détails du devis</h3>
                <div className="rounded-xl p-4 space-y-3" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-0.5">Service</div>
                      <div className="text-sm text-white">{SERVICE_LABEL[selected.serviceType] || selected.serviceType}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-0.5">Prix estimé</div>
                      <div className="text-sm text-cyan-400 font-bold font-mono">{fmtPrice(selected.estimatedPrice)}</div>
                    </div>
                    {selected.complexity && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase mb-0.5">Complexité</div>
                        <div className="text-sm text-white">{(['Simple', 'Moyen', 'Complexe'])[selected.complexity - 1] || selected.complexity}</div>
                      </div>
                    )}
                    {selected.modules && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase mb-0.5">Modules</div>
                        <div className="text-sm text-white">{selected.modules} module{selected.modules > 1 ? 's' : ''}</div>
                      </div>
                    )}
                    {selected.estimatedDays && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase mb-0.5">Délai estimé</div>
                        <div className="text-sm text-white">{selected.estimatedDays} jours</div>
                      </div>
                    )}
                  </div>

                  {/* Options choisies */}
                  {selected.options && Object.entries(selected.options).some(([, v]) => v) && (
                    <div className="pt-3 border-t" style={{ borderColor: '#1E2D4A' }}>
                      <div className="text-[10px] text-gray-500 uppercase mb-2">Options sélectionnées</div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(selected.options).filter(([, v]) => v).map(([k]) => (
                          <span key={k} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: '#00E5FF18', color: '#00E5FF', border: '1px solid #00E5FF40' }}>
                            {OPTION_LABEL[k] || k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  {selected.message && (
                    <div className="pt-3 border-t" style={{ borderColor: '#1E2D4A' }}>
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Message du client</div>
                      <p className="text-sm text-gray-300 leading-relaxed">{selected.message}</p>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">🔄 Changer le statut</h3>
                <div className="flex gap-2 flex-wrap">
                  {STATUTS.map(s => (
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

              <section>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">⚡ Actions rapides</h3>
                <div className="flex gap-2 flex-wrap">
                  <a href={`tel:${selected.clientPhone}`}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition"
                    style={{ background: '#0099FF20', color: '#0099FF', border: '1px solid #0099FF40' }}>
                    📞 Appeler
                  </a>
                  <a href={`https://wa.me/225${selected.clientPhone.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(selected.clientName)}%2C%20concernant%20votre%20demande%20de%20devis`}
                    target="_blank" rel="noreferrer"
                    className="px-3 py-2 rounded-lg text-xs font-medium transition"
                    style={{ background: '#25D36620', color: '#25D366', border: '1px solid #25D36640' }}>
                    💬 WhatsApp
                  </a>
                  <a href={`mailto:${selected.clientEmail}?subject=Devis ${selected.reference}`}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition"
                    style={{ background: '#F59E0B20', color: '#F59E0B', border: '1px solid #F59E0B40' }}>
                    ✉️ Email
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
