'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Boxes,
  CheckCircle2,
  History,
  PackagePlus,
  RefreshCw,
  Save,
  Settings,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';
import { resolveMediaUrl } from '@/lib/media';

type StockStatus = 'disponible' | 'faible' | 'rupture' | 'illimite';

interface StockProduct {
  _id: string;
  title: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  sku?: string;
  supplier?: string;
  lastUnitCost?: number;
  lastRestockedAt?: string;
  active: boolean;
  image?: string;
  stockStatus: StockStatus;
}

interface StockMovement {
  _id: string;
  type: string;
  quantity: number;
  beforeStock: number;
  afterStock: number;
  unitCost?: number;
  supplier?: string;
  reference?: string;
  note?: string;
  source: string;
  createdByName?: string;
  createdAt: string;
  productId?: StockProduct;
}

interface StockOverview {
  metrics: {
    totalProducts: number;
    totalUnits: number;
    inventoryValue: number;
    available: number;
    lowStock: number;
    outOfStock: number;
    unlimited: number;
    restockedThisMonth: number;
    soldThisMonth: number;
    purchasedValueThisMonth: number;
  };
  alerts: StockProduct[];
  products: StockProduct[];
  movements: StockMovement[];
}

type MovementType = 'approvisionnement' | 'sortie' | 'ajustement' | 'retour' | 'perte';

const STATUS_META: Record<StockStatus, { label: string; color: string }> = {
  disponible: { label: 'Disponible', color: '#10B981' },
  faible: { label: 'Stock faible', color: '#F59E0B' },
  rupture: { label: 'Rupture', color: '#EF4444' },
  illimite: { label: 'Illimité', color: '#00E5FF' },
};

const MOVEMENT_META: Record<MovementType, { label: string; color: string; icon: typeof ArrowUp }> = {
  approvisionnement: { label: 'Approvisionnement', color: '#10B981', icon: PackagePlus },
  sortie: { label: 'Sortie', color: '#EF4444', icon: ArrowDown },
  ajustement: { label: 'Ajustement', color: '#00E5FF', icon: SlidersHorizontal },
  retour: { label: 'Retour', color: '#A855F7', icon: ArrowUp },
  perte: { label: 'Perte', color: '#F59E0B', icon: AlertTriangle },
};

const EMPTY_MOVEMENT = {
  type: 'approvisionnement' as MovementType,
  quantity: 1,
  unitCost: 0,
  supplier: '',
  reference: '',
  note: '',
};

const fmt = (n: number) => `${new Intl.NumberFormat('fr-FR').format(Math.round(n || 0))} FCFA`;
const fmtNumber = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n || 0));
const fmtDate = (date?: string) => date ? new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Jamais';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Une erreur est survenue';
}

function MetricCard({ label, value, sub, color, icon: Icon }: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: typeof Boxes;
}) {
  return (
    <div className="p-4 rounded-lg relative overflow-hidden" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
      <Icon className="absolute top-4 right-4 w-6 h-6 opacity-20" style={{ color }} />
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">{label}</div>
      <div className="text-2xl font-black mb-1" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

export default function StockPage() {
  const [overview, setOverview] = useState<StockOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'tous' | StockStatus>('tous');
  const [selected, setSelected] = useState<StockProduct | null>(null);
  const [movement, setMovement] = useState(EMPTY_MOVEMENT);
  const [settings, setSettings] = useState({ lowStockThreshold: 5, sku: '', supplier: '' });

  const load = async () => {
    try {
      const response = await api.get<{ data: StockOverview }>('/api/stock');
      setOverview(response.data);
      setError('');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    api.get<{ data: StockOverview }>('/api/stock')
      .then((response) => {
        if (active) setOverview(response.data);
      })
      .catch((err: unknown) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openProduct = (product: StockProduct, type: MovementType = 'approvisionnement') => {
    setSelected(product);
    setMovement({ ...EMPTY_MOVEMENT, type });
    setSettings({
      lowStockThreshold: product.lowStockThreshold ?? 5,
      sku: product.sku || '',
      supplier: product.supplier || '',
    });
    setError('');
  };

  const saveMovement = async () => {
    if (!selected) return;
    setSaving(true);
    setError('');

    try {
      await api.post('/api/stock/mouvements', {
        productId: selected._id,
        ...movement,
      });
      setSelected(null);
      await load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    if (!selected) return;
    setSaving(true);
    setError('');

    try {
      const response = await api.patch<{ data: StockProduct }>(`/api/stock/produits/${selected._id}`, settings);
      setSelected(response.data);
      await load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const products = overview?.products || [];
  const filtered = products.filter((product) => {
    if (statusFilter !== 'tous' && product.stockStatus !== statusFilter) return false;
    if (!search) return true;
    const query = search.toLowerCase();
    return [product.title, product.category, product.subcategory, product.sku, product.supplier]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-gray-400 text-sm">
        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        Chargement du stock...
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col gap-6" style={{ color: '#E2E8F0' }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock</h1>
          <p className="text-sm text-gray-500">Approvisionnements, ruptures et niveau réel de la boutique</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher produit, SKU, fournisseur..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-72"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
          />
          <button
            onClick={load}
            className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
            style={{ background: '#1E2D4A', color: '#94A3B8' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
          {error}
        </div>
      )}

      {overview && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <MetricCard label="Références" value={overview.metrics.totalProducts} sub={`${overview.metrics.totalUnits} unités`} color="#00E5FF" icon={Boxes} />
            <MetricCard label="Valeur stock" value={fmt(overview.metrics.inventoryValue)} sub="Prix boutique" color="#A855F7" icon={CheckCircle2} />
            <MetricCard label="Disponible" value={overview.metrics.available} sub="Produits OK" color="#10B981" icon={CheckCircle2} />
            <MetricCard label="Stock faible" value={overview.metrics.lowStock} sub="À surveiller" color="#F59E0B" icon={AlertTriangle} />
            <MetricCard label="Rupture" value={overview.metrics.outOfStock} sub="À approvisionner" color="#EF4444" icon={X} />
            <MetricCard label="Ce mois" value={`+${overview.metrics.restockedThisMonth}`} sub={`-${overview.metrics.soldThisMonth} sorties`} color="#FF6B00" icon={PackagePlus} />
          </div>

          {overview.alerts.length > 0 && (
            <div className="rounded-lg p-4" style={{ background: '#120D12', border: '1px solid rgba(239,68,68,0.35)' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-bold text-white">Priorité approvisionnement</h2>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
                {overview.alerts.map((product) => {
                  const meta = STATUS_META[product.stockStatus];
                  return (
                    <button key={product._id} onClick={() => openProduct(product)} className="text-left p-3 rounded-lg transition hover:border-red-400/70"
                      style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                      <div className="text-sm font-semibold text-white truncate">{product.title}</div>
                      <div className="text-xs text-gray-500">{product.subcategory}</div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-bold" style={{ color: meta.color }}>{meta.label}</span>
                        <span className="text-lg font-black font-mono" style={{ color: meta.color }}>{product.stock < 0 ? '∞' : product.stock}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 min-h-0">
            <div className="flex flex-col min-h-0">
              <div className="flex gap-2 mb-4 flex-wrap">
                {(['tous', 'disponible', 'faible', 'rupture', 'illimite'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: statusFilter === status ? '#00E5FF' : '#1E2D4A',
                      color: statusFilter === status ? '#060D1F' : '#94A3B8',
                    }}
                  >
                    {status === 'tous' ? 'Tous' : STATUS_META[status].label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-auto rounded-lg" style={{ border: '1px solid #1E2D4A' }}>
                <table className="w-full text-sm">
                  <thead style={{ background: '#0B1628', borderBottom: '1px solid #1E2D4A' }}>
                    <tr>
                      {['Produit', 'Catégorie', 'SKU', 'Stock', 'Seuil', 'Fournisseur', 'Dernier appro.', 'Actions'].map((heading) => (
                        <th key={heading} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold whitespace-nowrap">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product, index) => {
                      const status = STATUS_META[product.stockStatus];
                      return (
                        <tr key={product._id} style={{ background: index % 2 === 0 ? '#060D1F' : '#070E1F', borderBottom: '1px solid #0d1a2e' }}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-10 rounded-md overflow-hidden flex-shrink-0" style={{ background: '#0B1628' }}>
                                {product.image ? (
                                  <img src={resolveMediaUrl(product.image)} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-[#00E5FF]/20 to-[#A855F7]/10" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-white truncate">{product.title}</div>
                                <div className="text-[11px] text-gray-500">{fmt(product.price)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">{product.category} · {product.subcategory}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 font-mono">{product.sku || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black font-mono" style={{ color: status.color }}>{product.stock < 0 ? '∞' : product.stock}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${status.color}22`, color: status.color }}>
                                {status.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">{product.lowStockThreshold}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{product.supplier || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(product.lastRestockedAt)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => openProduct(product, 'approvisionnement')} className="px-2 py-1 rounded text-[10px] font-semibold" style={{ background: '#10B98122', color: '#10B981' }}>Entrée</button>
                              <button onClick={() => openProduct(product, 'sortie')} className="px-2 py-1 rounded text-[10px] font-semibold" style={{ background: '#EF444422', color: '#EF4444' }}>Sortie</button>
                              <button onClick={() => openProduct(product, 'ajustement')} className="px-2 py-1 rounded text-[10px] font-semibold" style={{ background: '#1E2D4A', color: '#94A3B8' }}>Régler</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="rounded-lg p-4 h-fit" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Derniers mouvements</h2>
              </div>
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {overview.movements.map((item) => {
                  const type = item.type as MovementType;
                  const meta = MOVEMENT_META[type] || MOVEMENT_META.ajustement;
                  const Icon = meta.icon;
                  const productTitle = typeof item.productId === 'object' ? item.productId.title : 'Produit';
                  return (
                    <div key={item._id} className="p-3 rounded-lg" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}18`, color: meta.color }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">{productTitle}</div>
                          <div className="text-[11px] text-gray-500">{meta.label} · {fmtDate(item.createdAt)}</div>
                          <div className="text-xs mt-2">
                            <span className="font-mono" style={{ color: meta.color }}>{item.beforeStock} → {item.afterStock}</span>
                            <span className="text-gray-500"> · {fmtNumber(item.quantity)} unité{item.quantity > 1 ? 's' : ''}</span>
                          </div>
                          {(item.reference || item.supplier) && (
                            <div className="text-[11px] text-gray-500 mt-1 truncate">{item.reference || item.supplier}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {overview.movements.length === 0 && <p className="text-xs text-gray-500">Aucun mouvement pour le moment.</p>}
              </div>
            </aside>
          </div>
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-lg" style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-start justify-between p-5 border-b sticky top-0 z-10" style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
              <div>
                <div className="text-xs text-cyan-400 font-mono mb-1">{selected.sku || selected.category}</div>
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                <p className="text-xs text-gray-500">{selected.category} · {selected.subcategory}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white transition" style={{ background: '#1E2D4A' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 grid md:grid-cols-[1fr_280px] gap-5">
              <section className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div className="text-xs text-gray-500 mb-1">Stock actuel</div>
                    <div className="text-3xl font-black font-mono text-white">{selected.stock < 0 ? '∞' : selected.stock}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div className="text-xs text-gray-500 mb-1">Seuil alerte</div>
                    <div className="text-3xl font-black font-mono text-white">{settings.lowStockThreshold}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                    <div className="text-xs text-gray-500 mb-1">Valorisation</div>
                    <div className="text-lg font-black font-mono text-cyan-400">{fmt(selected.stock > 0 ? selected.stock * selected.price : 0)}</div>
                  </div>
                </div>

                <div className="rounded-lg p-4 space-y-3" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <PackagePlus className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Mouvement de stock</h3>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Type</label>
                    <select value={movement.type} onChange={(e) => setMovement(prev => ({ ...prev, type: e.target.value as MovementType }))}
                      className="w-full px-3 py-2 rounded-md text-white text-sm" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
                      {Object.entries(MOVEMENT_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">{movement.type === 'ajustement' ? 'Stock final' : 'Quantité'}</label>
                      <input type="number" min={0} value={movement.quantity} onChange={(e) => setMovement(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-md text-white text-sm outline-none" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Coût unitaire</label>
                      <input type="number" min={0} value={movement.unitCost} onChange={(e) => setMovement(prev => ({ ...prev, unitCost: Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-md text-white text-sm outline-none" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Fournisseur</label>
                      <input value={movement.supplier} onChange={(e) => setMovement(prev => ({ ...prev, supplier: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md text-white text-sm outline-none" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Référence</label>
                      <input value={movement.reference} onChange={(e) => setMovement(prev => ({ ...prev, reference: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md text-white text-sm outline-none" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Note</label>
                    <textarea value={movement.note} onChange={(e) => setMovement(prev => ({ ...prev, note: e.target.value }))}
                      rows={3} className="w-full px-3 py-2 rounded-md text-white text-sm outline-none resize-none" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }} />
                  </div>

                  <button onClick={saveMovement} disabled={saving} className="w-full py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2"
                    style={{ background: saving ? '#1E2D4A' : '#00E5FF', color: saving ? '#64748B' : '#060D1F' }}>
                    <Save className="w-4 h-4" />
                    {saving ? 'Enregistrement...' : 'Enregistrer le mouvement'}
                  </button>
                </div>
              </section>

              <aside className="rounded-lg p-4 h-fit space-y-3" style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Paramètres stock</h3>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">SKU</label>
                  <input value={settings.sku} onChange={(e) => setSettings(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3 py-2 rounded-md text-white text-sm outline-none" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Fournisseur principal</label>
                  <input value={settings.supplier} onChange={(e) => setSettings(prev => ({ ...prev, supplier: e.target.value }))}
                    className="w-full px-3 py-2 rounded-md text-white text-sm outline-none" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Seuil d&apos;alerte</label>
                  <input type="number" min={0} value={settings.lowStockThreshold} onChange={(e) => setSettings(prev => ({ ...prev, lowStockThreshold: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-md text-white text-sm outline-none" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }} />
                </div>
                <button onClick={saveSettings} disabled={saving} className="w-full py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2"
                  style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                  <Save className="w-4 h-4" />
                  Enregistrer paramètres
                </button>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
