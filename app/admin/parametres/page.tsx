'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function ParametresPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setError('');
    if (newPassword !== confirm) { setError('Les mots de passe ne correspondent pas'); return; }
    try {
      await api.patch('/api/users/me/password', { currentPassword, newPassword });
      setMsg('Mot de passe mis à jour avec succès');
      setCurrentPassword(''); setNewPassword(''); setConfirm('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Paramètres</h1>

      <div className="p-5 rounded-xl mb-6" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Mon profil</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ background: '#00E5FF22', color: '#00E5FF' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-white font-semibold">{user?.name}</div>
            <div className="text-gray-400 text-sm">{user?.email}</div>
            <div className="text-xs mt-0.5 capitalize px-2 py-0.5 rounded-full inline-block"
              style={{ background: '#00E5FF22', color: '#00E5FF' }}>
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Changer le mot de passe</h2>

        {msg && <div className="mb-3 p-3 rounded-lg text-sm text-green-400" style={{ background: 'rgba(16,185,129,0.1)' }}>{msg}</div>}
        {error && <div className="mb-3 p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)' }}>{error}</div>}

        <form onSubmit={changePassword} className="space-y-3">
          {[
            { label: 'Mot de passe actuel', val: currentPassword, set: setCurrentPassword },
            { label: 'Nouveau mot de passe', val: newPassword, set: setNewPassword },
            { label: 'Confirmer', val: confirm, set: setConfirm },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
              <input type="password" value={f.val} onChange={e => f.set(e.target.value)} required
                className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                style={{ background: '#060D1F', border: '1px solid #1E2D4A' }} />
            </div>
          ))}
          <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold mt-2"
            style={{ background: '#00E5FF', color: '#060D1F' }}>
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
}
