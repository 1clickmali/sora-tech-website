'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Contact {
  _id: string; name: string; email: string; phone?: string;
  subject: string; message: string; status: string; createdAt: string;
}

const STATUS_COLOR: Record<string, string> = { nouveau: '#00E5FF', traite: '#10B981', archive: '#64748B' };

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Contact[] }>('/api/contacts').then(r => setContacts(r.data)).finally(() => setLoading(false));
  }, []);

  const setStatus = async (id: string, status: string) => {
    await api.patch(`/api/contacts/${id}`, { status });
    setContacts(c => c.map(x => x._id === id ? { ...x, status } : x));
    if (selected?._id === id) setSelected({ ...selected, status });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Contacts <span className="text-sm text-gray-400 font-normal">({contacts.filter(c => c.status === 'nouveau').length} nouveaux)</span></h1>

      {loading ? <div className="text-gray-400 text-sm">Chargement...</div> : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0B1628' }}>
                {['Nom', 'Email', 'Sujet', 'Statut', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={c._id} className="border-t hover:bg-white/5 transition-colors cursor-pointer"
                  style={{ borderColor: '#1E2D4A', background: i % 2 === 0 ? '#060D1F' : '#0B1628' }}
                  onClick={() => setSelected(c)}>
                  <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-400">{c.email}</td>
                  <td className="px-4 py-3 text-gray-300">{c.subject}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      style={{ background: STATUS_COLOR[c.status] + '22', color: STATUS_COLOR[c.status] }}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {c.status !== 'traite' && (
                        <button onClick={e => { e.stopPropagation(); setStatus(c._id, 'traite'); }}
                          className="px-2 py-1 rounded text-xs" style={{ background: '#10B98122', color: '#10B981' }}>
                          Traiter
                        </button>
                      )}
                      {c.status !== 'archive' && (
                        <button onClick={e => { e.stopPropagation(); setStatus(c._id, 'archive'); }}
                          className="px-2 py-1 rounded text-xs" style={{ background: '#1E2D4A', color: '#64748B' }}>
                          Archiver
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

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="flex justify-between">
              <div className="text-lg font-bold text-white">{selected.name}</div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Email : <a href={'mailto:' + selected.email} className="text-cyan-400">{selected.email}</a></div>
              {selected.phone && <div>Tél : <span className="text-white">{selected.phone}</span></div>}
              <div>Sujet : <span className="text-white">{selected.subject}</span></div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-sm text-gray-300">{selected.message}</div>
            <div className="flex gap-2">
              <a href={'mailto:' + selected.email} className="flex-1 text-center py-2 rounded-lg text-sm font-medium"
                style={{ background: '#00E5FF22', color: '#00E5FF' }}>
                Répondre par email
              </a>
              <button onClick={() => setStatus(selected._id, 'traite')}
                className="flex-1 py-2 rounded-lg text-sm font-medium"
                style={{ background: '#10B98122', color: '#10B981' }}>
                Marquer traité
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
