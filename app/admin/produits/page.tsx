'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { resolveMediaUrl } from '@/lib/media';
import {
  DEFAULT_SUBCATEGORY,
  PRODUCT_CATEGORIES,
  getProductDisplayMeta,
  getSubcategoriesForCategory,
  normalizeProductTaxonomy,
} from '@/lib/productTaxonomy';

interface Produit {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  stock: number;
  active: boolean;
  image?: string;
  badge?: string;
  digital: boolean;
  features: string[];
}

type ProduitForm = {
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  stock: number;
  active: boolean;
  digital: boolean;
  badge: string;
  image: string;
  features: string[];
};

type ProduitField = {
  key: 'title' | 'price' | 'badge';
  label: string;
  type: 'text' | 'number';
};

const EMPTY: ProduitForm = {
  title: '',
  description: '',
  price: 0,
  category: 'Logiciel',
  subcategory: DEFAULT_SUBCATEGORY.Logiciel,
  stock: -1,
  active: true,
  digital: true,
  badge: '',
  image: '',
  features: [] as string[],
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Une erreur est survenue';
}

const PRODUIT_FIELDS: ProduitField[] = [
  { key: 'title', label: 'Nom du produit', type: 'text' },
  { key: 'price', label: 'Prix (FCFA)', type: 'number' },
  { key: 'badge', label: 'Badge (ex: NOUVEAU)', type: 'text' },
];

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
    api
      .get<{ data: Produit[] }>('/api/produits?limit=100')
      .then((r) => setProduits(r.data.map((produit) => normalizeProductTaxonomy(produit))))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const availableSubcategories =
    filterCat === 'Tous'
      ? []
      : getSubcategoriesForCategory(filterCat);

  const formSubcategories = getSubcategoriesForCategory(form.category);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((prev) => ({ ...prev, image: (ev.target?.result as string) || '' }));
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (category: string) => {
    setForm((prev) => ({
      ...prev,
      category,
      subcategory: DEFAULT_SUBCATEGORY[category as 'Matériel' | 'Logiciel'],
      digital: category === 'Logiciel',
      stock: category === 'Logiciel' ? -1 : prev.stock,
    }));
  };

  const save = async () => {
    setError('');
    setSaving(true);

    try {
      const payload = normalizeProductTaxonomy({
        ...form,
        title: form.title?.trim(),
        description: form.description?.trim(),
        badge: form.badge?.trim(),
        image: form.image?.trim?.() || form.image || '',
        features: Array.isArray(form.features)
          ? form.features.filter(Boolean)
          : String(form.features || '')
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean),
      });

      if (editing) await api.patch(`/api/produits/${editing}`, payload);
      else await api.post('/api/produits', payload);

      setShowForm(false);
      setEditing(null);
      setForm(EMPTY);
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.delete(`/api/produits/${id}`);
    load();
  };

  const startEdit = (produit: Produit) => {
    setForm({ ...EMPTY, ...normalizeProductTaxonomy(produit) });
    setEditing(produit._id);
    setError('');
    setShowForm(true);
  };

  const fmt = (value: number) => `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`;

  const actifs = produits.filter((produit) => produit.active).length;
  const digitaux = produits.filter((produit) => produit.digital).length;
  const stockFaible = produits.filter((produit) => !produit.digital && produit.stock >= 0 && produit.stock <= 5).length;

  const filtered = produits.filter((produit) => {
    if (filterCat !== 'Tous' && produit.category !== filterCat) return false;
    if (filterSubcategory !== 'Tous' && produit.subcategory !== filterSubcategory) return false;
    if (search) {
      const query = search.toLowerCase();
      return (
        produit.title.toLowerCase().includes(query) ||
        produit.description.toLowerCase().includes(query) ||
        produit.subcategory.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stockColor = (produit: Produit) => {
    if (produit.digital || produit.stock === -1) return '#00E5FF';
    if (produit.stock === 0) return '#EF4444';
    if (produit.stock <= 5) return '#F59E0B';
    return '#10B981';
  };

  const stockLabel = (produit: Produit) => {
    if (produit.digital) return 'Digital';
    if (produit.stock === -1) return 'Illimité';
    if (produit.stock === 0) return 'Rupture';
    return `Stock : ${produit.stock}`;
  };

  return (
    <div className="p-6 h-full flex flex-col" style={{ color: '#E2E8F0' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="text-sm text-gray-500">{produits.length} produit{produits.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="px-3 py-2 rounded-lg text-sm outline-none w-56"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', color: '#E2E8F0' }}
          />
          <button
            onClick={() => {
              setForm(EMPTY);
              setEditing(null);
              setError('');
              setShowForm(true);
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            style={{ background: '#00E5FF', color: '#060D1F' }}
          >
            + Ajouter un produit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total produits', value: produits.length, color: '#00E5FF' },
          { label: 'Actifs', value: actifs, color: '#10B981' },
          { label: 'Digitaux', value: digitaux, color: '#8B5CF6' },
          { label: 'Stock faible (≤5)', value: stockFaible, color: stockFaible > 0 ? '#F59E0B' : '#94A3B8' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
            <div className="text-2xl font-black mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {stockFaible > 0 && (
        <div
          className="mb-5 p-3 rounded-lg text-sm flex items-center gap-2"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}
        >
          ⚠️ {stockFaible} produit{stockFaible > 1 ? 's ont' : ' a'} un stock faible ou en rupture.
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {['Tous', ...PRODUCT_CATEGORIES].map((category) => (
          <button
            key={category}
            onClick={() => {
              setFilterCat(category);
              setFilterSubcategory('Tous');
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
            style={{
              background: filterCat === category ? '#00E5FF' : '#1E2D4A',
              color: filterCat === category ? '#060D1F' : '#94A3B8',
            }}
          >
            {category}
            {category !== 'Tous' && <span className="text-[10px] opacity-70">({produits.filter((produit) => produit.category === category).length})</span>}
          </button>
        ))}
      </div>

      {availableSubcategories.length > 0 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {['Tous', ...availableSubcategories].map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => setFilterSubcategory(subcategory)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5"
              style={{
                background: filterSubcategory === subcategory ? '#0EA5E9' : '#13233C',
                color: filterSubcategory === subcategory ? '#F8FAFC' : '#94A3B8',
              }}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-20">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-sm">Aucun produit{filterCat !== 'Tous' ? ' dans cette catégorie' : ''}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((produit) => {
            const meta = getProductDisplayMeta(produit.category, produit.subcategory);
            const Icon = meta.icon;

            return (
              <div key={produit._id} className="p-4 rounded-xl" style={{ background: '#0B1628', border: '1px solid #1E2D4A' }}>
                <div className="w-full h-36 rounded-lg overflow-hidden mb-3" style={{ background: '#060D1F' }}>
                  {produit.image ? (
                    <img src={resolveMediaUrl(produit.image)} alt={produit.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${meta.color}25, ${meta.color}08)` }}>
                      <Icon className="w-10 h-10" style={{ color: meta.color }} />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <div className="text-white font-semibold truncate">{produit.title}</div>
                    <div className="text-xs text-gray-500">{produit.category} · {produit.subcategory}</div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs flex-shrink-0"
                    style={{ background: produit.active ? '#10B98122' : '#EF444422', color: produit.active ? '#10B981' : '#EF4444' }}
                  >
                    {produit.active ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{produit.description}</p>

                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-bold font-mono" style={{ color: meta.color }}>{fmt(produit.price)}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${stockColor(produit)}22`, color: stockColor(produit) }}
                  >
                    {stockLabel(produit)}
                  </span>
                </div>

                {produit.features?.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {produit.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="text-xs text-gray-400">• {feature}</div>
                    ))}
                  </div>
                )}

                {!produit.digital && produit.stock > 0 && produit.stock !== -1 && (
                  <div className="mb-3">
                    <div className="h-1.5 rounded-full" style={{ background: '#1E2D4A' }}>
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (produit.stock / 20) * 100)}%`,
                          background: produit.stock <= 5 ? '#F59E0B' : '#10B981',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(produit)}
                    className="flex-1 py-1.5 rounded text-xs font-medium"
                    style={{ background: '#1E2D4A', color: '#94A3B8' }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => del(produit._id)}
                    className="flex-1 py-1.5 rounded text-xs font-medium"
                    style={{ background: '#EF444422', color: '#EF4444' }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: '#0B1628', border: '1px solid #1E2D4A', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
          >
            <div
              className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
              style={{ borderColor: '#1E2D4A', background: '#0B1628' }}
            >
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouveau'} produit</h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition"
                style={{ background: '#1E2D4A' }}
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)' }}>{error}</div>}

              {PRODUIT_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key] ?? ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Catégorie</label>
                <select
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Sous-catégorie</label>
                <select
                  value={form.subcategory}
                  onChange={(e) => setForm((prev) => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                >
                  {formSubcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>

              {!form.digital && (
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Stock (-1 = illimité)</label>
                  <input
                    type="number"
                    value={form.stock ?? -1}
                    onChange={(e) => setForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Description</label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Points forts</label>
                <textarea
                  value={Array.isArray(form.features) ? form.features.join('\n') : ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      features: e.target.value
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean),
                    }))
                  }
                  rows={4}
                  placeholder={"Une ligne par avantage\nEx: Gestion des stocks\nTableau de bord temps réel"}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                  style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Photo du produit</label>
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                    style={{ background: '#1E2D4A', color: '#94A3B8' }}
                  >
                    Choisir image
                  </button>
                  <input
                    type="text"
                    placeholder="ou coller une URL"
                    value={form.image?.startsWith('data:') ? '' : (form.image || '')}
                    onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-xs outline-none"
                    style={{ background: '#060D1F', border: '1px solid #1E2D4A' }}
                  />
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                {form.image && (
                  <img src={resolveMediaUrl(form.image)} alt="preview" className="mt-2 h-24 rounded-lg object-cover w-full" />
                )}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-300">Actif</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.digital}
                    onChange={(e) => setForm((prev) => ({ ...prev, digital: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-300">Produit digital</span>
                </label>
              </div>

              <button
                onClick={save}
                disabled={saving}
                className="w-full py-2.5 rounded-lg text-sm font-bold"
                style={{ background: saving ? '#1E2D4A' : '#00E5FF', color: saving ? '#64748B' : '#060D1F' }}
              >
                {saving ? 'Enregistrement...' : editing ? 'Enregistrer les modifications' : 'Créer le produit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
