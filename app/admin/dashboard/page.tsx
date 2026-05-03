'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

interface Stats {
  commandes: { total: number; mois: number; evolution: number; lastMonth: number };
  revenue: { total: number; mois: number };
  devis: { total: number; nouveaux: number; tauxConversion: number };
  contacts: { total: number; nouveaux: number };
  factures: { impayees: number; montantImpaye: number };
  stock: {
    totalProducts: number;
    totalUnits: number;
    inventoryValue: number;
    lowStock: number;
    outOfStock: number;
    restockedThisMonth: number;
    soldThisMonth: number;
    alerts: {
      _id: string;
      title: string;
      category: string;
      subcategory: string;
      stock: number;
      lowStockThreshold: number;
      stockStatus: 'faible' | 'rupture' | 'disponible' | 'illimite';
    }[];
  };
  charts: {
    revenueParMois: { mois: string; revenue: number; commandes: number }[];
    statutsCommandes: Record<string, number>;
  };
}

const STATUS_COLOR: Record<string, string> = {
  nouveau: '#00E5FF', confirme: '#A855F7', en_cours: '#F59E0B',
  en_livraison: '#FF6B00', livre: '#10B981', annule: '#EF4444',
};
const STATUS_LABEL: Record<string, string> = {
  nouveau: 'Nouveaux', confirme: 'Confirmés', en_cours: 'En cours',
  en_livraison: 'En livraison', livre: 'Livrés', annule: 'Annulés',
};

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(n);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Erreur inconnue';
}

function StatCard({ label, value, sub, color = '#00E5FF', icon }: {
  label: string; value: string | number; sub?: string; color?: string; icon: string;
}) {
  return (
    <div className="p-5 rounded-xl relative overflow-hidden" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
      <div className="absolute top-4 right-4 text-2xl opacity-20">{icon}</div>
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">{label}</div>
      <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await api.get<{ data: Stats }>(`/api/stats?t=${Date.now()}`);
      setStats(r.data);
      setError('');
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setRefreshing(false);
      setLastRefresh(new Date());
    }
  }, []);

  useEffect(() => {
    let active = true;

    api.get<{ data: Stats }>(`/api/stats?t=${Date.now()}`)
      .then(r => {
        if (active) {
          setStats(r.data);
          setError('');
        }
      })
      .catch((e: unknown) => {
        if (active) setError(getErrorMessage(e));
      })
      .finally(() => {
        if (active) setLastRefresh(new Date());
      });

    const interval = setInterval(load, 30_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [load]);

  if (error) return (
    <div className="p-8">
      <div className="text-red-400 text-sm p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
        ⚠️ Erreur : {error} — Vérifiez que le backend est démarré et que vous êtes connecté.
      </div>
    </div>
  );

  if (!stats) return (
    <div className="p-8 flex items-center gap-3 text-gray-400 text-sm">
      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      Chargement des statistiques...
    </div>
  );

  const evolution = stats.commandes.evolution;
  const evolutionLabel = evolution > 0 ? `↑ +${evolution}% vs mois dernier` : evolution < 0 ? `↓ ${evolution}% vs mois dernier` : '= Stable vs mois dernier';
  const evolutionColor = evolution > 0 ? '#10B981' : evolution < 0 ? '#EF4444' : '#94A3B8';

  return (
    <div className="p-4 md:p-6 space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-xs md:text-sm text-gray-500">Vue d&apos;ensemble — SORA TECH</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="hidden sm:block text-xs text-gray-500">
            Actualisé à {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <button onClick={load} disabled={refreshing}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            style={{ background: '#1E2D4A', color: refreshing ? '#64748B' : '#94A3B8' }}>
            {refreshing ? (
              <><div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" /> Actualisation...</>
            ) : '🔄 Actualiser'}
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total commandes"
          value={stats.commandes.total}
          sub={`${stats.commandes.mois} ce mois`}
          color="#00E5FF"
          icon="🛒"
        />
        <StatCard
          label="Revenus ce mois"
          value={fmt(stats.revenue.mois)}
          sub={`Total : ${fmt(stats.revenue.total)}`}
          color="#A855F7"
          icon="💰"
        />
        <StatCard
          label="Devis en attente"
          value={stats.devis.nouveaux}
          sub={`Taux conversion : ${stats.devis.tauxConversion}%`}
          color="#F59E0B"
          icon="📋"
        />
        <StatCard
          label="Messages"
          value={stats.contacts.nouveaux}
          sub={`Total : ${stats.contacts.total}`}
          color="#10B981"
          icon="✉️"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Valeur stock"
          value={fmt(stats.stock.inventoryValue)}
          sub={`${stats.stock.totalUnits} unités physiques`}
          color="#00E5FF"
          icon="▣"
        />
        <StatCard
          label="Ruptures"
          value={stats.stock.outOfStock}
          sub="À réapprovisionner"
          color="#EF4444"
          icon="!"
        />
        <StatCard
          label="Stock faible"
          value={stats.stock.lowStock}
          sub="Sous le seuil d'alerte"
          color="#F59E0B"
          icon="↓"
        />
        <StatCard
          label="Mouvements mois"
          value={`+${stats.stock.restockedThisMonth}`}
          sub={`-${stats.stock.soldThisMonth} sorties`}
          color="#10B981"
          icon="↕"
        />
      </div>

      {/* Evolution badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: evolutionColor + '20', color: evolutionColor }}>
          {evolutionLabel}
        </span>
        {stats.factures.impayees > 0 && (
          <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: '#EF444420', color: '#EF4444' }}>
            ⚠️ {stats.factures.impayees} facture{stats.factures.impayees > 1 ? 's' : ''} impayée{stats.factures.impayees > 1 ? 's' : ''} — {fmt(stats.factures.montantImpaye)}
          </span>
        )}
        {(stats.stock.outOfStock > 0 || stats.stock.lowStock > 0) && (
          <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: '#F59E0B20', color: '#F59E0B' }}>
            Stock : {stats.stock.outOfStock} rupture{stats.stock.outOfStock > 1 ? 's' : ''}, {stats.stock.lowStock} faible{stats.stock.lowStock > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
          <h2 className="text-sm font-semibold text-gray-300 mb-4">📈 Revenus — 6 derniers mois</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.charts.revenueParMois}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
              <XAxis dataKey="mois" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip contentStyle={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0', borderRadius: 8 }}
                formatter={(v: unknown) => [fmt(Number(v) || 0), 'Revenus']} />
              <Area type="monotone" dataKey="revenue" stroke="#00E5FF" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
          <h2 className="text-sm font-semibold text-gray-300 mb-4">📦 Commandes par mois</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.charts.revenueParMois}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
              <XAxis dataKey="mois" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0', borderRadius: 8 }} />
              <Bar dataKey="commandes" fill="#A855F7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statuts + résumé */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
          <h2 className="text-sm font-semibold text-gray-300 mb-4">🔄 Répartition des commandes</h2>
          <div className="space-y-3">
            {Object.entries(stats.charts.statutsCommandes).map(([s, n]) => {
              const total = Object.values(stats.charts.statutsCommandes).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? Math.round((n / total) * 100) : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{STATUS_LABEL[s] || s}</span>
                    <span className="font-semibold" style={{ color: STATUS_COLOR[s] || '#94A3B8' }}>{n} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: '#1E2D4A' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: STATUS_COLOR[s] || '#94A3B8' }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(stats.charts.statutsCommandes).length === 0 && (
              <p className="text-xs text-gray-500">Aucune commande enregistrée.</p>
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
          <h2 className="text-sm font-semibold text-gray-300 mb-4">▣ Alertes stock boutique</h2>
          <div className="space-y-3">
            {stats.stock.alerts.map(item => {
              const color = item.stockStatus === 'rupture' ? '#EF4444' : '#F59E0B';
              return (
                <div key={item._id} className="flex justify-between items-center py-2 border-b text-sm"
                  style={{ borderColor: '#1E2D4A' }}>
                  <div className="min-w-0">
                    <div className="text-gray-300 font-semibold truncate">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.subcategory} · seuil {item.lowStockThreshold}</div>
                  </div>
                  <span className="font-bold font-mono ml-4" style={{ color }}>{item.stock}</span>
                </div>
              );
            })}
            {stats.stock.alerts.length === 0 && (
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-400">Aucune alerte stock</span>
                <span className="font-bold text-emerald-400">OK</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
          <h2 className="text-sm font-semibold text-gray-300 mb-4">📊 Résumé global</h2>
          <div className="space-y-3">
            {[
              { label: 'Total commandes', value: stats.commandes.total, color: '#00E5FF' },
              { label: 'Revenue total', value: fmt(stats.revenue.total), color: '#A855F7' },
              { label: 'Total devis', value: stats.devis.total, color: '#F59E0B' },
              { label: 'Total contacts', value: stats.contacts.total, color: '#10B981' },
              { label: 'Factures impayées', value: stats.factures.impayees, color: '#EF4444' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b text-sm"
                style={{ borderColor: '#1E2D4A' }}>
                <span className="text-gray-400">{item.label}</span>
                <span className="font-bold font-mono" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
