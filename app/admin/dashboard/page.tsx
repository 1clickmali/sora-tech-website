'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

interface Stats {
  commandes: { total: number; mois: number; evolution: number };
  revenue: { total: number; mois: number };
  devis: { total: number; nouveaux: number; tauxConversion: number };
  contacts: { total: number; nouveaux: number };
  factures: { impayees: number; montantImpaye: number };
  charts: { revenueParMois: { mois: string; revenue: number; commandes: number }[]; statutsCommandes: Record<string, number> };
}

function StatCard({ label, value, sub, color = '#00E5FF' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<{ data: Stats }>('/api/stats')
      .then(r => setStats(r.data))
      .catch(e => setError(e.message));
  }, []);

  if (error) return (
    <div className="p-8">
      <div className="text-red-400 text-sm p-4 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
        Erreur : {error} — Vérifiez que le backend tourne sur le port 5000.
      </div>
    </div>
  );

  if (!stats) return (
    <div className="p-8 text-gray-400 text-sm">Chargement des statistiques...</div>
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Vue d&apos;ensemble de l&apos;activité SORA TECH</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Commandes ce mois" value={stats.commandes.mois}
          sub={stats.commandes.evolution + '% vs mois dernier'} color="#00E5FF" />
        <StatCard label="Revenus (mois)" value={fmt(stats.revenue.mois)}
          sub={'Total : ' + fmt(stats.revenue.total)} color="#A855F7" />
        <StatCard label="Devis nouveaux" value={stats.devis.nouveaux}
          sub={'Taux conversion : ' + stats.devis.tauxConversion + '%'} color="#F59E0B" />
        <StatCard label="Contacts nouveaux" value={stats.contacts.nouveaux}
          sub={'Total : ' + stats.contacts.total} color="#10B981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Revenus 6 derniers mois</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.charts.revenueParMois}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
              <XAxis dataKey="mois" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }} />
              <Bar dataKey="revenue" fill="#00E5FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Commandes par mois</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.charts.revenueParMois}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
              <XAxis dataKey="mois" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }} />
              <Line type="monotone" dataKey="commandes" stroke="#A855F7" strokeWidth={2} dot={{ fill: '#A855F7' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Statuts commandes</h2>
          {Object.entries(stats.charts.statutsCommandes).map(([s, n]) => (
            <div key={s} className="flex justify-between text-sm py-1.5 border-b" style={{ borderColor: '#1E2D4A' }}>
              <span className="text-gray-400 capitalize">{s.replace('_', ' ')}</span>
              <span className="text-white font-medium">{n}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl col-span-1 lg:col-span-2" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Factures impayées</h2>
          <div className="text-3xl font-bold text-red-400 mb-1">{stats.factures.impayees}</div>
          <div className="text-gray-400 text-sm">Montant total : <span className="text-red-400 font-semibold">{fmt(stats.factures.montantImpaye)}</span></div>
        </div>
      </div>
    </div>
  );
}
