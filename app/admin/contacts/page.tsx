'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface Contact {
  _id: string;
  name: string; email: string; phone?: string;
  company?: string; service?: string; budget?: string;
  message?: string; status: string;
  source?: string; clientStatus?: string;
  quartier?: string; address?: string;
  totalOrders?: number; totalSpent?: number;
  lastOrderDate?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  nouveau: '#00E5FF', traite: '#10B981', archive: '#64748B',
};
const CLIENT_STATUS_COLOR: Record<string, string> = {
  lead: '#F59E0B', client: '#0099FF', vip: '#A855F7', inactif: '#64748B',
};
const SOURCE_LABEL: Record<string, string> = {
  contact_form: 'Formulaire', commande: 'Commande', devis: 'Devis', manual: 'Manuel',
};

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'messages' | 'crm'>('messages');
  const [selected, setSelected] = useState<Contact | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (filter !== 'tous') params.set('status', filter);
      if (search) params.set('search', search);
      const r = await api.get<{ data: Contact[]; total: number }>(`/api/contacts?${params}`);
      setContacts(r.data);
      setTotal(r.total);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: string) => {
    await api.patch(`/api/contacts/${id}`, { status });
    setContacts(c => c.map(x => x._id === id ? { ...x, status } : x));
    if (selected?._id === id) setSelected(s => s ? { ...s, status } : null);
  };

  const saveNotes = async (id: string) => {
    await api.patch(`/api/contacts/${id}`, { notes: editNotes });
    setContacts(c => c.map(x => x._id === id ? { ...x, notes: editNotes } : x));
    if (selected?._id === id) setSelected(s => s ? { ...s, notes: editNotes } : null);
  };

  // Split: messages (contact_form) vs CRM clients (commandes/devis)
  const messages = contacts.filter(c => !c.source || c.source === 'contact_form');
  const clients = contacts.filter(c => c.source && c.source !== 'contact_form');
  const displayed = view === 'messages' ? messages : clients;

  // Stats
  const nouveaux = messages.filter(c => c.status === 'nouveau').length;
  const vips = contacts.filter(c => c.clientStatus === 'vip').length;
  const totalClients = clients.length;
  const totalRevenu = clients.reduce((s, c) => s + (c.totalSpent || 0), 0);

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts & CRM</h1>
          <p className="text-sm text-gray-500">Messages clients + base de données CRM</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Messages', value: messages.length, sub: `${nouveaux} nouveaux`, color: '#00E5FF', icon: '✉️' },
          { label: 'Clients CRM', value: totalClients, color: '#0099FF', icon: '👥' },
          { label: 'VIP', value: vips, color: '#A855F7', icon: '⭐' },
          { label: 'Revenu clients', value: fmt(totalRevenu), color: '#10B981', icon: '💰' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-xl relative overflow-hidden"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="absolute top-4 right-4 text-2xl opacity-20">{s.icon}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">{s.label}</div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            {s.sub && <div className="text-xs text-gray-500 mt-1">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* View toggle + Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* View tabs */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
          <button onClick={() => setView('messages')}
            className="px-4 py-2 text-xs font-semibold transition"
            style={{ background: view === 'messages' ? '#00E5FF20' : 'transparent', color: view === 'messages' ? '#00E5FF' : '#64748B' }}>
            ✉️ Messages ({messages.length})
          </button>
          <button onClick={() => setView('crm')}
            className="px-4 py-2 text-xs font-semibold transition"
            style={{ background: view === 'crm' ? '#0099FF20' : 'transparent', color: view === 'crm' ? '#0099FF' : '#64748B' }}>
            👥 CRM ({clients.length})
          </button>
        </div>

        {/* Status filter for messages */}
        {view === 'messages' && (
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
            {[{ k: 'tous', l: 'Tous' }, { k: 'nouveau', l: 'Nouveaux' }, { k: 'traite', l: 'Traités' }, { k: 'archive', l: 'Archivés' }].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)}
                className="px-3 py-2 text-xs font-semibold transition"
                style={{ background: filter === f.k ? '#1E2D4A' : 'transparent', color: filter === f.k ? '#E2E8F0' : '#64748B' }}>
                {f.l}
              </button>
            ))}
          </div>
        )}

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Chercher par nom, email, tél..."
          className="px-3 py-2 rounded-lg text-sm outline-none text-white"
          style={{ background: '#0B1628', border: '1px solid #1E2D4A', minWidth: 220 }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          Chargement...
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0B1628' }}>
                {view === 'messages'
                  ? ['Nom', 'Email / Tél', 'Service', 'Message', 'Statut', 'Date', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))
                  : ['Nom', 'Contact', 'Quartier', 'Commandes', 'Dépensé', 'Statut client', 'Source', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 text-sm">
                    Aucun résultat
                  </td>
                </tr>
              ) : displayed.map((c, i) => (
                <tr key={c._id} className="border-t cursor-pointer transition"
                  style={{ borderColor: '#1E2D4A', background: i % 2 === 0 ? '#060D1F' : '#080F20' }}
                  onClick={() => { setSelected(c); setEditNotes(c.notes || ''); }}>
                  <td className="px-4 py-3">
                    <div className="text-white font-semibold">{c.name}</div>
                    {c.company && <div className="text-xs text-gray-500">{c.company}</div>}
                  </td>

                  {view === 'messages' ? (
                    <>
                      <td className="px-4 py-3">
                        <div className="text-gray-300 text-xs">{c.email}</div>
                        {c.phone && <div className="text-gray-500 text-xs">{c.phone}</div>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{c.service || '—'}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="text-xs text-gray-400 truncate">{c.message}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: STATUS_COLOR[c.status] + '22', color: STATUS_COLOR[c.status] }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1">
                          {c.status !== 'traite' && (
                            <button onClick={() => setStatus(c._id, 'traite')}
                              className="px-2 py-1 rounded text-xs"
                              style={{ background: '#10B98122', color: '#10B981' }}>Traiter</button>
                          )}
                          {c.status !== 'archive' && (
                            <button onClick={() => setStatus(c._id, 'archive')}
                              className="px-2 py-1 rounded text-xs"
                              style={{ background: '#1E2D4A', color: '#64748B' }}>Archiver</button>
                          )}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-300">{c.email}</div>
                        {c.phone && <div className="text-xs text-gray-500">{c.phone}</div>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{c.quartier || '—'}</td>
                      <td className="px-4 py-3 text-xs font-mono font-bold text-white">{c.totalOrders || 0}</td>
                      <td className="px-4 py-3 text-xs font-mono font-bold text-green-400">
                        {fmt(c.totalSpent || 0)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize"
                          style={{ background: CLIENT_STATUS_COLOR[c.clientStatus || 'lead'] + '22', color: CLIENT_STATUS_COLOR[c.clientStatus || 'lead'] }}>
                          {c.clientStatus || 'lead'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {SOURCE_LABEL[c.source || ''] || c.source || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {c.phone && (
                          <a href={`tel:${c.phone}`} onClick={e => e.stopPropagation()}
                            className="px-2 py-1 rounded text-xs"
                            style={{ background: '#0099FF22', color: '#0099FF' }}>Appeler</a>
                        )}
                      </td>
                    </>
                  )}
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
                <div className="text-xl font-bold text-white">{selected.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  {selected.clientStatus && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: CLIENT_STATUS_COLOR[selected.clientStatus] + '22', color: CLIENT_STATUS_COLOR[selected.clientStatus] }}>
                      {selected.clientStatus.toUpperCase()}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{new Date(selected.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}>✕</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Contact info */}
              <div className="rounded-xl p-4" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Coordonnées</div>
                <div className="space-y-1.5 text-sm">
                  {selected.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-16">Email</span>
                      <a href={`mailto:${selected.email}`} className="text-cyan-400">{selected.email}</a>
                    </div>
                  )}
                  {selected.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-16">Tél</span>
                      <a href={`tel:${selected.phone}`} className="text-white">{selected.phone}</a>
                    </div>
                  )}
                  {selected.quartier && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-16">Quartier</span>
                      <span className="text-white">{selected.quartier}</span>
                    </div>
                  )}
                  {selected.company && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-16">Société</span>
                      <span className="text-white">{selected.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CRM stats (if client) */}
              {(selected.totalOrders !== undefined || selected.totalSpent !== undefined) && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl text-center" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div className="text-2xl font-black text-cyan-400">{selected.totalOrders || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">Commandes</div>
                  </div>
                  <div className="p-3 rounded-xl text-center" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div className="text-lg font-black text-green-400 font-mono">{fmt(selected.totalSpent || 0)}</div>
                    <div className="text-xs text-gray-500 mt-1">Total dépensé</div>
                  </div>
                  {selected.lastOrderDate && (
                    <div className="col-span-2 p-3 rounded-xl text-center text-xs text-gray-500"
                      style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                      Dernière commande : {new Date(selected.lastOrderDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {selected.tags && selected.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: '#1E2D4A', color: '#94A3B8' }}>{tag}</span>
                  ))}
                </div>
              )}

              {/* Message (contact form) */}
              {selected.message && (
                <div className="rounded-xl p-4" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Message</div>
                  <div className="text-sm text-gray-300">{selected.message}</div>
                  {selected.service && (
                    <div className="text-xs text-gray-500 mt-2">Service : {selected.service}</div>
                  )}
                  {selected.budget && (
                    <div className="text-xs text-gray-500">Budget : {selected.budget}</div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Notes internes</div>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  rows={3}
                  placeholder="Ajouter une note..."
                  className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none resize-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                />
                <button onClick={() => saveNotes(selected._id)}
                  className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                  Sauvegarder note
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {selected.email && (
                  <a href={`mailto:${selected.email}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold"
                    style={{ background: '#00E5FF20', color: '#00E5FF', border: '1px solid #00E5FF30' }}>
                    Répondre
                  </a>
                )}
                {selected.phone && (
                  <>
                    <a href={`tel:${selected.phone}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold"
                      style={{ background: '#0099FF20', color: '#0099FF', border: '1px solid #0099FF30' }}>
                      Appeler
                    </a>
                    <a href={`https://wa.me/225${selected.phone.replace(/\D/g, '')}`}
                      target="_blank" rel="noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-bold"
                      style={{ background: '#25D36620', color: '#25D366', border: '1px solid #25D36630' }}>
                      WhatsApp
                    </a>
                  </>
                )}
                {selected.status !== 'traite' && (
                  <button onClick={() => setStatus(selected._id, 'traite')}
                    className="px-4 py-2 rounded-xl text-xs font-bold"
                    style={{ background: '#10B98120', color: '#10B981', border: '1px solid #10B98130' }}>
                    Traité
                  </button>
                )}
                {selected.status !== 'archive' && (
                  <button onClick={() => setStatus(selected._id, 'archive')}
                    className="px-4 py-2 rounded-xl text-xs font-bold"
                    style={{ background: '#1E2D4A', color: '#64748B' }}>
                    Archiver
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
