'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface User { _id: string; name: string; email: string; role: string; active: boolean; createdAt: string; }

const ROLE_COLOR: Record<string, string> = {
  super_admin: '#EF4444', admin: '#F59E0B', commercial: '#00E5FF', comptable: '#10B981',
};
const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin', admin: 'Admin', commercial: 'Commercial', comptable: 'Comptable',
};
const ROLES = ['commercial', 'comptable', 'admin', 'super_admin'];
const EMPTY = { name: '', email: '', password: '', role: 'commercial', active: true };

export default function EquipePage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => api.get<{ data: User[] }>('/api/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const save = async () => {
    await api.post('/api/auth/register', form);
    setShowForm(false); setForm(EMPTY); load();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await api.patch(`/api/users/${id}`, { active: !active });
    setUsers(u => u.map(x => x._id === id ? { ...x, active: !active } : x));
  };

  const del = async (id: string) => {
    await api.delete(`/api/users/${id}`); load();
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const actifs = users.filter(u => u.active).length;
  const admins = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length;

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Équipe</h1>
          <p className="text-sm text-gray-500">{users.length} membre{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-52"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
          />
          {(me?.role === 'admin' || me?.role === 'super_admin') && (
            <button onClick={() => { setForm(EMPTY); setShowForm(true); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
              style={{ background: '#00E5FF', color: '#060D1F' }}>
              + Ajouter un membre
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total membres', value: users.length, color: '#00E5FF' },
          { label: 'Actifs', value: actifs, color: '#10B981' },
          { label: 'Admins', value: admins, color: '#F59E0B' },
          { label: 'Inactifs', value: users.length - actifs, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-20">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-sm">Aucun membre trouvé.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-xl" style={{ border: '1px solid #1E2D4A' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#0B1628', borderBottom: '1px solid #1E2D4A' }}>
              <tr>
                {['Membre', 'Email', 'Rôle', 'Statut', 'Depuis', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id} className="transition-colors"
                  style={{ background: i % 2 === 0 ? '#060D1F' : '#070E1F', borderBottom: '1px solid #0d1a2e' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: ROLE_COLOR[u.role] + '22', color: ROLE_COLOR[u.role] }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize"
                      style={{ background: ROLE_COLOR[u.role] + '22', color: ROLE_COLOR[u.role] }}>
                      {ROLE_LABEL[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: u.active ? '#10B98122' : '#EF444422', color: u.active ? '#10B981' : '#EF4444' }}>
                      {u.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    {me?.role === 'super_admin' && u._id !== me._id ? (
                      <div className="flex gap-1">
                        <button onClick={() => toggleActive(u._id, u.active)}
                          className="px-2 py-1 rounded text-[10px] font-medium"
                          style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                          {u.active ? 'Désactiver' : 'Activer'}
                        </button>
                        <button onClick={() => del(u._id)}
                          className="px-2 py-1 rounded text-[10px] font-medium"
                          style={{ background: '#EF444422', color: '#EF4444' }}>
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-md rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
              style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
              <h2 className="text-lg font-bold text-white">Nouveau membre</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { k: 'name', l: 'Nom complet', t: 'text' },
                { k: 'email', l: 'Email', t: 'email' },
                { k: 'password', l: 'Mot de passe', t: 'password' },
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">{f.l}</label>
                  <input type={f.t} value={form[f.k] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.k]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Rôle</label>
                <select value={form.role} onChange={e => setForm((p: any) => ({ ...p, role: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                  {ROLES.filter(r => me?.role === 'super_admin' || r !== 'super_admin').map(r => (
                    <option key={r} value={r}>{ROLE_LABEL[r] || r}</option>
                  ))}
                </select>
              </div>
              <button onClick={save} className="w-full py-2.5 rounded-lg text-sm font-bold"
                style={{ background: '#00E5FF', color: '#060D1F' }}>
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
