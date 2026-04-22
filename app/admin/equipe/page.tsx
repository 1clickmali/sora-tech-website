'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface User { _id: string; name: string; email: string; role: string; active: boolean; createdAt: string; }

const ROLE_COLOR: Record<string, string> = { super_admin: '#EF4444', admin: '#F59E0B', commercial: '#00E5FF', comptable: '#10B981' };
const ROLES = ['commercial', 'comptable', 'admin', 'super_admin'];

const EMPTY = { name: '', email: '', password: '', role: 'commercial', active: true };

export default function EquipePage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Équipe</h1>
        {(me?.role === 'admin' || me?.role === 'super_admin') && (
          <button onClick={() => { setForm(EMPTY); setShowForm(true); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#00E5FF', color: '#060D1F' }}>
            + Ajouter un membre
          </button>
        )}
      </div>

      {loading ? <div className="text-gray-400 text-sm">Chargement...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u._id} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ background: ROLE_COLOR[u.role] + '22', color: ROLE_COLOR[u.role] }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{u.name}</div>
                  <div className="text-gray-500 text-xs">{u.email}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{ background: ROLE_COLOR[u.role] + '22', color: ROLE_COLOR[u.role] }}>
                  {u.role.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: u.active ? '#10B98122' : '#EF444422', color: u.active ? '#10B981' : '#EF4444' }}>
                  {u.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              {me?.role === 'super_admin' && u._id !== me._id && (
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(u._id, u.active)} className="flex-1 py-1.5 rounded text-xs font-medium"
                    style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                    {u.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button onClick={() => del(u._id)} className="flex-1 py-1.5 rounded text-xs font-medium"
                    style={{ background: '#EF444422', color: '#EF4444' }}>
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Nouveau membre</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            {[{ k: 'name', l: 'Nom complet', t: 'text' }, { k: 'email', l: 'Email', t: 'email' }, { k: 'password', l: 'Mot de passe', t: 'password' }].map(f => (
              <div key={f.k}>
                <label className="block text-xs text-gray-400 mb-1">{f.l}</label>
                <input type={f.t} value={form[f.k] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.k]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rôle</label>
              <select value={form.role} onChange={e => setForm((p: any) => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-white text-sm"
                style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                {ROLES.filter(r => me?.role === 'super_admin' || r !== 'super_admin').map(r => (
                  <option key={r} value={r}>{r.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <button onClick={save} className="w-full py-2.5 rounded-lg text-sm font-bold" style={{ background: '#00E5FF', color: '#060D1F' }}>
              Créer le compte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
