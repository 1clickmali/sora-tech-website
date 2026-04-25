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

  const ROLE_COLOR: Record<string, string> = {
    super_admin: '#EF4444', admin: '#F59E0B', commercial: '#00E5FF', comptable: '#10B981',
  };
  const roleColor = ROLE_COLOR[user?.role || ''] || '#00E5FF';

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-sm text-gray-500">Gérer votre compte et vos préférences</p>
      </div>

      <div className="max-w-xl space-y-5">
        {/* Profil */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
          <div className="px-6 py-4 border-b" style={{ background: '#0B1628', borderColor: '#1E2D4A' }}>
            <h2 className="text-xs text-gray-500 uppercase tracking-widest font-semibold">👤 Mon profil</h2>
          </div>
          <div className="p-5" style={{ background: '#060D1F' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{ background: roleColor + '22', color: roleColor }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-white font-bold text-lg">{user?.name}</div>
                <div className="text-gray-400 text-sm">{user?.email}</div>
                <span className="inline-block text-xs mt-1 px-2 py-0.5 rounded-full font-semibold capitalize"
                  style={{ background: roleColor + '22', color: roleColor }}>
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mot de passe */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2D4A' }}>
          <div className="px-6 py-4 border-b" style={{ background: '#0B1628', borderColor: '#1E2D4A' }}>
            <h2 className="text-xs text-gray-500 uppercase tracking-widest font-semibold">🔒 Changer le mot de passe</h2>
          </div>
          <div className="p-5" style={{ background: '#060D1F' }}>
            {msg && (
              <div className="mb-4 p-3 rounded-lg text-sm text-green-400"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                ✓ {msg}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
            <form onSubmit={changePassword} className="space-y-3">
              {[
                { label: 'Mot de passe actuel', val: currentPassword, set: setCurrentPassword },
                { label: 'Nouveau mot de passe', val: newPassword, set: setNewPassword },
                { label: 'Confirmer le nouveau mot de passe', val: confirm, set: setConfirm },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">{f.label}</label>
                  <input type="password" value={f.val} onChange={e => f.set(e.target.value)} required
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#0B1628', border: '1px solid #1E2D4A' }} />
                </div>
              ))}
              <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold mt-2"
                style={{ background: '#00E5FF', color: '#060D1F' }}>
                Mettre à jour
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
