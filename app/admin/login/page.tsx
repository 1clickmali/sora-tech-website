'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function AdminLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('admin@soratech.ci');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060D1F' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
        <div className="text-center mb-8">
          <div className="text-3xl font-black mb-1" style={{ color: '#00E5FF' }}>SORA TECH</div>
          <div className="text-gray-400 text-sm">Panneau d'administration</div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2"
              style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
              style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-sm transition-all"
            style={{ background: loading ? '#1E2D4A' : '#00E5FF', color: '#060D1F' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
