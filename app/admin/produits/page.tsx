'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Globe, Monitor, Shield, ShoppingCart, Smartphone, Wrench,
  Server, Printer, Wifi, Package, Layers, DollarSign, Settings,
  BookOpen, type LucideIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { resolveMediaUrl } from '@/lib/media';
import {
  DEFAULT_SUBCATEGORY,
  PRODUCT_CATEGORIES,
  getProductDisplayMeta,
  getSubcategoriesForCategory,
  normalizeProductTaxonomy,
} from '@/lib/productTaxonomy';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Specs {
  brand: string; color: string; storage: string; ram: string;
  processor: string; os: string; screen: string; battery: string;
  condition: string; warranty: string;
}

interface Produit {
  _id: string; title: string; description: string; price: number;
  category: string; subcategory: string; stock: number; active: boolean;
  image?: string; badge?: string; digital: boolean; features: string[];
  specs?: Partial<Specs>;
}

type ProduitForm = {
  title: string; description: string; price: number;
  category: string; subcategory: string; stock: number; active: boolean;
  digital: boolean; badge: string; image: string; features: string[];
  specs: Specs;
};

const EMPTY_SPECS: Specs = {
  brand: '', color: '', storage: '', ram: '', processor: '',
  os: '', screen: '', battery: '', condition: 'Neuf', warranty: '',
};

const EMPTY: ProduitForm = {
  title: '', description: '', price: 0,
  category: 'Logiciel', subcategory: DEFAULT_SUBCATEGORY.Logiciel,
  stock: -1, active: true, digital: true, badge: '', image: '',
  features: [], specs: { ...EMPTY_SPECS },
};

// ─── Category / Subcategory visual config ────────────────────────────────────

const CAT_CONFIG: { key: string; label: string; icon: LucideIcon; color: string; desc: string }[] = [
  { key: 'Logiciel', label: 'Logiciel', icon: Monitor, color: '#0099FF', desc: 'Applications, ERP, Office…' },
  { key: 'Matériel', label: 'Matériel', icon: Smartphone, color: '#FF6B00', desc: 'Téléphones, Ordinateurs…' },
];

const SUBCAT_CONFIG: Record<string, { icon: LucideIcon; color: string }> = {
  'Téléphone':                        { icon: Smartphone,   color: '#FF6B00' },
  'Ordinateur':                       { icon: Monitor,      color: '#FF8B3D' },
  'Serveur':                          { icon: Server,       color: '#FF9F66' },
  'Imprimante':                       { icon: Printer,      color: '#FFB38F' },
  'Réseau':                           { icon: Wifi,         color: '#FF8B3D' },
  'Accessoires':                      { icon: Package,      color: '#FFB38F' },
  'Microsoft Office':                 { icon: Monitor,      color: '#0099FF' },
  'Odoo':                             { icon: Globe,        color: '#6BB6FF' },
  "Gestion d'entreprise":             { icon: BookOpen,     color: '#00C48C' },
  'Gestion alimentation / magasin':   { icon: ShoppingCart, color: '#FF6B00' },
  'ERP / CRM':                        { icon: Settings,     color: '#9B93FF' },
  'Comptabilité':                     { icon: DollarSign,   color: '#00C48C' },
  'Cybersécurité':                    { icon: Shield,       color: '#FF4757' },
  'Sur mesure':                       { icon: Wrench,       color: '#00C48C' },
  'Layers':                           { icon: Layers,       color: '#9B93FF' },
};

// ─── Hardware specs config ─────────────────────────────────────────────────

type SpecField = { key: keyof Specs; label: string; type: 'text' | 'select' | 'condition'; options?: string[] };

const SPEC_FIELDS: Record<string, SpecField[]> = {
  Téléphone: [
    { key: 'brand',     label: 'Marque',        type: 'text' },
    { key: 'color',     label: 'Couleur',        type: 'text' },
    { key: 'storage',   label: 'Stockage',       type: 'select', options: ['16 Go', '32 Go', '64 Go', '128 Go', '256 Go', '512 Go', '1 To'] },
    { key: 'ram',       label: 'RAM',            type: 'select', options: ['2 Go', '3 Go', '4 Go', '6 Go', '8 Go', '12 Go', '16 Go'] },
    { key: 'screen',    label: 'Taille écran',   type: 'text' },
    { key: 'battery',   label: 'Batterie (mAh)', type: 'text' },
    { key: 'os',        label: 'Système',        type: 'select', options: ['Android', 'iOS', 'HarmonyOS', 'Autre'] },
    { key: 'warranty',  label: 'Garantie',       type: 'text' },
    { key: 'condition', label: 'État',           type: 'condition' },
  ],
  Ordinateur: [
    { key: 'brand',     label: 'Marque',         type: 'text' },
    { key: 'color',     label: 'Couleur',        type: 'text' },
    { key: 'processor', label: 'Processeur',     type: 'text' },
    { key: 'ram',       label: 'RAM',            type: 'select', options: ['4 Go', '8 Go', '16 Go', '32 Go', '64 Go'] },
    { key: 'storage',   label: 'Stockage',       type: 'text' },
    { key: 'screen',    label: 'Taille écran',   type: 'text' },
    { key: 'os',        label: 'Système',        type: 'select', options: ['Windows 11', 'Windows 10', 'macOS', 'Ubuntu', 'Linux', 'Sans OS'] },
    { key: 'warranty',  label: 'Garantie',       type: 'text' },
    { key: 'condition', label: 'État',           type: 'condition' },
  ],
  Serveur: [
    { key: 'brand',     label: 'Marque',         type: 'text' },
    { key: 'processor', label: 'Processeur',     type: 'text' },
    { key: 'ram',       label: 'RAM',            type: 'select', options: ['8 Go', '16 Go', '32 Go', '64 Go', '128 Go', '256 Go'] },
    { key: 'storage',   label: 'Stockage',       type: 'text' },
    { key: 'os',        label: 'Système',        type: 'select', options: ['Windows Server', 'Ubuntu Server', 'CentOS', 'Proxmox', 'Sans OS'] },
    { key: 'warranty',  label: 'Garantie',       type: 'text' },
    { key: 'condition', label: 'État',           type: 'condition' },
  ],
  Imprimante: [
    { key: 'brand',   label: 'Marque',  type: 'text' },
    { key: 'color',   label: 'Couleur', type: 'text' },
    { key: 'storage', label: 'Type',    type: 'select', options: ['Laser couleur', 'Laser N&B', "Jet d'encre couleur", "Jet d'encre N&B", 'Multifonction'] },
    { key: 'screen',  label: 'Format',  type: 'select', options: ['A4', 'A3', 'A4/A3'] },
    { key: 'condition', label: 'État',  type: 'condition' },
  ],
  Réseau: [
    { key: 'brand',   label: 'Marque',  type: 'text' },
    { key: 'storage', label: 'Type',    type: 'select', options: ['Routeur WiFi', 'Switch', 'Access Point', 'Firewall', 'Modem', 'Câble réseau'] },
    { key: 'screen',  label: 'Vitesse', type: 'select', options: ['100 Mbps', '1 Gbps', 'WiFi 5 (AC)', 'WiFi 6 (AX)', '10 Gbps'] },
    { key: 'condition', label: 'État',  type: 'condition' },
  ],
  Accessoires: [
    { key: 'brand',   label: 'Marque',  type: 'text' },
    { key: 'color',   label: 'Couleur', type: 'text' },
    { key: 'storage', label: 'Type',    type: 'text' },
    { key: 'condition', label: 'État',  type: 'condition' },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function specsToFeatures(specs: Specs): string[] {
  const map: [keyof Specs, string][] = [
    ['condition', 'État'], ['brand', 'Marque'], ['color', 'Couleur'],
    ['storage', 'Stockage'], ['ram', 'RAM'], ['processor', 'Processeur'],
    ['os', 'Système'], ['screen', 'Écran'], ['battery', 'Batterie'],
    ['warranty', 'Garantie'],
  ];
  return map.filter(([k]) => specs[k]).map(([k, label]) => `${label} : ${specs[k]}`);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Une erreur est survenue';
}

const fmt = (value: number) => `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`;

const stockColor = (p: Produit) => {
  if (p.digital || p.stock === -1) return '#00E5FF';
  if (p.stock === 0) return '#EF4444';
  if (p.stock <= 5) return '#F59E0B';
  return '#10B981';
};

const stockLabel = (p: Produit) => {
  if (p.digital) return 'Digital';
  if (p.stock === -1) return 'Illimité';
  if (p.stock === 0) return 'Rupture';
  return `Stock : ${p.stock}`;
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [form, setForm] = useState<ProduitForm>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCat, setFilterCat] = useState('Tous');
  const [filterSubcategory, setFilterSubcategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () =>
    api.get<{ data: Produit[] }>('/api/produits?limit=100')
      .then((r) => setProduits(r.data.map((p) => normalizeProductTaxonomy(p))))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const availableSubcategories = filterCat === 'Tous' ? [] : getSubcategoriesForCategory(filterCat);
  const formSubcategories = getSubcategoriesForCategory(form.category);
  const specFields = SPEC_FIELDS[form.subcategory] || [];

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((prev) => ({ ...prev, image: (ev.target?.result as string) || '' }));
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (category: string) => {
    const sub = DEFAULT_SUBCATEGORY[category as 'Matériel' | 'Logiciel'];
    setForm((prev) => ({
      ...prev, category, subcategory: sub,
      digital: category === 'Logiciel',
      stock: category === 'Logiciel' ? -1 : prev.stock,
      specs: { ...EMPTY_SPECS },
    }));
  };

  const handleSubcatChange = (sub: string) => {
    setForm((prev) => ({ ...prev, subcategory: sub, specs: { ...EMPTY_SPECS } }));
  };

  const setSpec = (key: keyof Specs, value: string) =>
    setForm((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));

  const save = async () => {
    setError(''); setSaving(true);
    try {
      const autoFeatures = form.category === 'Matériel' ? specsToFeatures(form.specs) : [];
      const manualFeatures = Array.isArray(form.features)
        ? form.features.filter(Boolean)
        : String(form.features || '').split('\n').map((l) => l.trim()).filter(Boolean);

      const payload = normalizeProductTaxonomy({
        ...form,
        title: form.title?.trim(),
        description: form.description?.trim(),
        badge: form.badge?.trim(),
        image: form.image?.trim?.() || form.image || '',
        features: [...autoFeatures, ...manualFeatures.filter(f => !autoFeatures.includes(f))],
      });

      if (editing) await api.patch(`/api/produits/${editing}`, payload);
      else await api.post('/api/produits', payload);

      setShowForm(false); setEditing(null); setForm(EMPTY); load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.delete(`/api/produits/${id}`); load();
  };

  const startEdit = (p: Produit) => {
    setForm({
      ...EMPTY, ...normalizeProductTaxonomy(p),
      specs: { ...EMPTY_SPECS, ...(p.specs || {}) },
    });
    setEditing(p._id); setError(''); setShowForm(true);
  };

  const actifs = produits.filter((p) => p.active).length;
  const digitaux = produits.filter((p) => p.digital).length;
  const stockFaible = produits.filter((p) => !p.digital && p.stock >= 0 && p.stock <= 5).length;

  const filtered = produits.filter((p) => {
    if (filterCat !== 'Tous' && p.category !== filterCat) return false;
    if (filterSubcategory !== 'Tous' && p.subcategory !== filterSubcategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q);
    }
    return true;
  });

  const inp = 'w-full px-3 py-2 rounded-lg text-white text-sm outline-none';
  const inpStyle = { background: '#060D1F', border: '1px solid #1E2D4A' };

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="text-sm text-gray-500">{produits.length} produit{produits.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-52" style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }} />
          <button onClick={() => { setForm(EMPTY); setEditing(null); setError(''); setShowForm(true); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap" style={{ background: '#00E5FF', color: '#060D1F' }}>
            + Ajouter un produit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total', value: produits.length, color: '#00E5FF' },
          { label: 'Actifs', value: actifs, color: '#10B981' },
          { label: 'Digitaux', value: digitaux, color: '#8B5CF6' },
          { label: 'Stock faible', value: stockFaible, color: stockFaible > 0 ? '#F59E0B' : '#94A3B8' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {stockFaible > 0 && (
        <div className="mb-5 p-3 rounded-lg text-sm flex items-center gap-2"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
          ⚠️ {stockFaible} produit{stockFaible > 1 ? 's ont' : ' a'} un stock faible.
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['Tous', ...PRODUCT_CATEGORIES].map((cat) => (
          <button key={cat} onClick={() => { setFilterCat(cat); setFilterSubcategory('Tous'); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: filterCat === cat ? '#00E5FF' : '#1E2D4A', color: filterCat === cat ? '#060D1F' : '#94A3B8' }}>
            {cat} {cat !== 'Tous' && `(${produits.filter((p) => p.category === cat).length})`}
          </button>
        ))}
      </div>

      {availableSubcategories.length > 0 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {['Tous', ...availableSubcategories].map((sub) => (
            <button key={sub} onClick={() => setFilterSubcategory(sub)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
              style={{ background: filterSubcategory === sub ? '#0EA5E9' : '#13233C', color: filterSubcategory === sub ? '#F8FAFC' : '#94A3B8' }}>
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      {loading ? (
        <div className="text-gray-400 text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-20">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-sm">Aucun produit{filterCat !== 'Tous' ? ' dans cette catégorie' : ''}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const meta = getProductDisplayMeta(p.category, p.subcategory);
            const Icon = meta.icon;
            return (
              <div key={p._id} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
                <div className="w-full h-36 rounded-lg overflow-hidden mb-3" style={{ background: '#060D1F' }}>
                  {p.image ? (
                    <img src={resolveMediaUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${meta.color}25, ${meta.color}08)` }}>
                      <Icon className="w-10 h-10" style={{ color: meta.color }} />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <div className="text-white font-semibold truncate">{p.title}</div>
                    <div className="text-xs text-gray-500">{p.category} · {p.subcategory}</div>
                    {p.specs?.condition && <div className="text-[10px] mt-0.5" style={{ color: p.specs.condition === 'Neuf' ? '#10B981' : '#F59E0B' }}>{p.specs.condition}</div>}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs flex-shrink-0"
                    style={{ background: p.active ? '#10B98122' : '#EF444422', color: p.active ? '#10B981' : '#EF4444' }}>
                    {p.active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                {p.specs?.brand && <div className="text-xs text-gray-400 mb-1">🏷️ {p.specs.brand}{p.specs.color ? ` · ${p.specs.color}` : ''}</div>}
                {p.specs?.storage && <div className="text-xs text-gray-400 mb-1">💾 {p.specs.storage}{p.specs.ram ? ` · RAM ${p.specs.ram}` : ''}</div>}
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-bold font-mono" style={{ color: meta.color }}>{fmt(p.price)}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${stockColor(p)}22`, color: stockColor(p) }}>
                    {stockLabel(p)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="flex-1 py-1.5 rounded text-xs font-medium" style={{ background: '#1E2D4A', color: '#94A3B8' }}>Modifier</button>
                  <button onClick={() => del(p._id)} className="flex-1 py-1.5 rounded text-xs font-medium" style={{ background: '#EF444422', color: '#EF4444' }}>Supprimer</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── FORM MODAL ───────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 z-10" style={{ borderColor: '#1E2D4A', background: '#0B1628' }}>
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouveau'} produit</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition" style={{ background: '#1E2D4A' }}>✕</button>
            </div>

            <div className="p-6 space-y-6">
              {error && <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)' }}>{error}</div>}

              {/* ── 1. CATÉGORIE mosaic ── */}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-3">Catégorie</label>
                <div className="grid grid-cols-2 gap-3">
                  {CAT_CONFIG.map(({ key, label, icon: Icon, color, desc }) => (
                    <button key={key} type="button" onClick={() => handleCategoryChange(key)}
                      className="p-4 rounded-xl text-left transition-all"
                      style={{
                        border: `2px solid ${form.category === key ? color : '#1E2D4A'}`,
                        background: form.category === key ? `${color}15` : '#060D1F',
                      }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="text-sm font-bold text-white">{label}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── 2. SOUS-CATÉGORIE mosaic ── */}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-3">Sous-catégorie</label>
                <div className="grid grid-cols-3 gap-2">
                  {formSubcategories.map((sub) => {
                    const cfg = SUBCAT_CONFIG[sub] || { icon: Monitor, color: '#0099FF' };
                    const SubIcon = cfg.icon;
                    const active = form.subcategory === sub;
                    return (
                      <button key={sub} type="button" onClick={() => handleSubcatChange(sub)}
                        className="p-3 rounded-xl text-center transition-all"
                        style={{
                          border: `1.5px solid ${active ? cfg.color : '#1E2D4A'}`,
                          background: active ? `${cfg.color}20` : '#060D1F',
                        }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5"
                          style={{ background: `${cfg.color}20` }}>
                          <SubIcon className="w-4 h-4" style={{ color: cfg.color }} />
                        </div>
                        <div className="text-[10px] font-semibold leading-tight" style={{ color: active ? cfg.color : '#94A3B8' }}>
                          {sub.length > 18 ? sub.slice(0, 17) + '…' : sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── 3. CARACTÉRISTIQUES MATÉRIEL ── */}
              {form.category === 'Matériel' && specFields.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1" style={{ background: '#1E2D4A' }} />
                    <span className="text-xs text-[#FF6B00] uppercase tracking-widest font-bold px-2">Caractéristiques matériel</span>
                    <div className="h-px flex-1" style={{ background: '#1E2D4A' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {specFields.map((f) => {
                      if (f.type === 'condition') {
                        return (
                          <div key={f.key} className="col-span-2">
                            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">{f.label}</label>
                            <div className="flex gap-2">
                              {['Neuf', 'Occasion'].map((v) => (
                                <button key={v} type="button" onClick={() => setSpec('condition', v)}
                                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                                  style={{
                                    border: `2px solid ${form.specs.condition === v ? (v === 'Neuf' ? '#10B981' : '#F59E0B') : '#1E2D4A'}`,
                                    background: form.specs.condition === v ? (v === 'Neuf' ? '#10B98120' : '#F59E0B20') : '#060D1F',
                                    color: form.specs.condition === v ? (v === 'Neuf' ? '#10B981' : '#F59E0B') : '#94A3B8',
                                  }}>
                                  {v === 'Neuf' ? '✨ Neuf' : '♻️ Occasion'}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      if (f.type === 'select') {
                        return (
                          <div key={f.key}>
                            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">{f.label}</label>
                            <select value={form.specs[f.key] || ''} onChange={(e) => setSpec(f.key, e.target.value)}
                              className={inp} style={inpStyle}>
                              <option value="">— Sélectionner —</option>
                              {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        );
                      }
                      return (
                        <div key={f.key}>
                          <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">{f.label}</label>
                          <input type="text" value={form.specs[f.key] || ''} onChange={(e) => setSpec(f.key, e.target.value)}
                            className={inp} style={inpStyle} placeholder={f.label} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── 4. INFOS GÉNÉRALES ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1" style={{ background: '#1E2D4A' }} />
                  <span className="text-xs text-[#00E5FF] uppercase tracking-widest font-bold px-2">Informations générales</span>
                  <div className="h-px flex-1" style={{ background: '#1E2D4A' }} />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Nom du produit *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      className={inp} style={inpStyle} placeholder="Ex: Samsung Galaxy A54" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Prix (FCFA) *</label>
                      <input type="number" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                        className={inp} style={inpStyle} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Badge</label>
                      <input type="text" value={form.badge} onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                        className={inp} style={inpStyle} placeholder="NOUVEAU, PROMO…" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3} className={`${inp} resize-none`} style={inpStyle} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">
                      Points forts supplémentaires
                    </label>
                    <textarea
                      value={Array.isArray(form.features) ? form.features.join('\n') : ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, features: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean) }))}
                      rows={3} placeholder={"Une ligne par avantage\nEx: Livraison rapide\nSupport inclus"}
                      className={`${inp} resize-none`} style={inpStyle} />
                    {form.category === 'Matériel' && (
                      <p className="text-[10px] text-gray-600 mt-1">Les caractéristiques matériel sont ajoutées automatiquement.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── 5. STOCK & OPTIONS ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1" style={{ background: '#1E2D4A' }} />
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-bold px-2">Options</span>
                  <div className="h-px flex-1" style={{ background: '#1E2D4A' }} />
                </div>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))} />
                    <span className="text-sm text-gray-300">Actif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.digital} onChange={(e) => setForm((prev) => ({ ...prev, digital: e.target.checked }))} />
                    <span className="text-sm text-gray-300">Produit digital</span>
                  </label>
                </div>
                {!form.digital && (
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Stock (-1 = illimité)</label>
                    <input type="number" value={form.stock ?? -1} onChange={(e) => setForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                      className={inp} style={inpStyle} />
                  </div>
                )}
              </div>

              {/* ── 6. IMAGE ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1" style={{ background: '#1E2D4A' }} />
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-bold px-2">Photo</span>
                  <div className="h-px flex-1" style={{ background: '#1E2D4A' }} />
                </div>
                <div className="flex gap-2 items-center">
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap" style={{ background: '#1E2D4A', color: '#94A3B8' }}>
                    Choisir image
                  </button>
                  <input type="text" placeholder="ou coller une URL"
                    value={form.image?.startsWith('data:') ? '' : (form.image || '')}
                    onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-xs outline-none" style={inpStyle} />
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                {form.image && <img src={resolveMediaUrl(form.image)} alt="preview" className="mt-2 h-24 rounded-lg object-cover w-full" />}
              </div>

              {/* Save */}
              <button onClick={save} disabled={saving}
                className="w-full py-3 rounded-lg text-sm font-bold"
                style={{ background: saving ? '#1E2D4A' : '#00E5FF', color: saving ? '#64748B' : '#060D1F' }}>
                {saving ? 'Enregistrement...' : editing ? 'Enregistrer les modifications' : 'Créer le produit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
